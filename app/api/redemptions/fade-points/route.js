import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import admin from 'firebase-admin'

import { adminDb }
  from '@/lib/firebase-admin'

// NOTE:
// - This project currently uses Firebase client-side updates for payments.
// - For points redemption, we MUST enforce affordability + idempotency on the server.

function parseInteger(value, { min = 0, max = 1000000000 } = {}) {
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  if (i < min || i > max) return null
  return i
}

function safeTrim(s) {
  return String(s ?? '').trim()
}

function sanitizeDeliveryCommands(cmds) {
  const arr = Array.isArray(cmds) ? cmds : []
  // Prevent obvious injection by restricting to a conservative character set.
  // You can expand this list later as your in-game command executor matures.
  const allowed = /^[a-zA-Z0-9_\-\s:\/\.,@#()\[\]{}=!$]*$/
  return arr
    .map((c) => safeTrim(c))
    .filter(Boolean)
    .map((c) => {
      if (c.length > 200) return null
      if (!allowed.test(c)) return null
      return c
    })
    .filter(Boolean)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { cart, mcName, buyerEmail, idempotencyKey } = body || {}

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Missing cart items' }, { status: 400 })
    }

    const safeIdempotencyKey = safeTrim(idempotencyKey) || `red-${Date.now()}`
    if (safeIdempotencyKey.length > 200) {
      return NextResponse.json({ error: 'Invalid idempotencyKey' }, { status: 400 })
    }

    const userId =
  session.user.discordId

    const userRef =
      adminDb.collection('users').doc(userId)
    const userSnap = await userRef.get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userSnap.data() || {}
    const currentPoints = parseInteger(userData.points, { min: 0, max: 100000000000 })
    const pointsBalance = currentPoints ?? 0

    // Fetch all products referenced in cart in one query cycle.
    // (For now, cart item count is small; later you can batch getDocs.)
    const productIds = Array.from(new Set(cart.map((i) => String(i?.id || i?.productId || '')))).filter(Boolean)

    if (productIds.length === 0) {
      return NextResponse.json({ error: 'No valid product ids' }, { status: 400 })
    }

    const productsSnap =
      await adminDb.collection('products').get()
    const productsById = new Map()
    productsSnap.forEach((d) => productsById.set(d.id, d.data()))

    // Validate cart items are money products and compute total points cost.
    let totalPointsCost = 0
    const validatedItems = []

    for (const item of cart) {
      const productId = String(item?.id || item?.productId || '')
      const qty = parseInteger(item?.qty ?? item?.quantity ?? 1, { min: 1, max: 100 })
      if (!productId || qty === null) {
        return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
      }

      const product = productsById.get(productId)
      if (!product) return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 404 })
      if (product?.cat !== 'money') {
        return NextResponse.json({ error: 'Points redemption only supports money-category products' }, { status: 400 })
      }

      const pointsCost = parseInteger(product?.pointsCost, { min: 1, max: 1000000000 })
      const inGameMoneyAmount = parseInteger(product?.inGameMoneyAmount, { min: 0, max: 1000000000 })
      const redemptionDescription = safeTrim(product?.redemptionDescription)

      if (pointsCost === null) {
        return NextResponse.json({ error: `Invalid pointsCost for product ${productId}` }, { status: 400 })
      }

      // Store commands from product, not from client.
      const deliveryCommands = sanitizeDeliveryCommands(product?.deliveryCommands)

      totalPointsCost += pointsCost * qty

      validatedItems.push({
        productId,
        qty,
        pointsCost,
        inGameMoneyAmount,
        redemptionDescription,
        deliveryCommands,
      })
    }

    if (totalPointsCost <= 0) {
      return NextResponse.json({ error: 'Invalid total points cost' }, { status: 400 })
    }

    // Delivery + idempotency + points deduction in a single transaction.
    const result =
      await adminDb.runTransaction(async (tx) => {
        const uSnap = await tx.get(userRef)
        const uData = uSnap.data() || {}
        const current = parseInteger(uData.points, { min: 0, max: 100000000000 }) ?? 0

        // Initialize ledger.
        const ledger = Array.isArray(uData?.redemptionLedger) ? uData.redemptionLedger : []
        const alreadyDone = ledger.some((l) => l?.idempotencyKey === safeIdempotencyKey && l?.status === 'success')
        if (alreadyDone) {
          return { ok: true, alreadyProcessed: true, pointsBalance: current, totalPointsCost }
        }

        if (current < totalPointsCost) {
          return { ok: false, error: 'Insufficient points', pointsBalance: current, totalPointsCost }
        }

        const newBalance = current - totalPointsCost

        // Record ledger entries. Delivery commands execution should be handled by a worker/service.
        // For now, we record them to a queue field.
        const now = new Date()
        const deliveryQueue = Array.isArray(uData?.deliveryQueue) ? uData.deliveryQueue : []

        const ledgerEntry = {
          id: `${now.getTime()}-${Math.random().toString(36).slice(2, 10)}`,
          idempotencyKey: safeIdempotencyKey,
          status: 'success',
          // serverTimestamp() cannot be used inside arrays; store an ISO string instead.
          createdAt: now.toISOString(),
          mcName: safeTrim(mcName),
          buyerEmail: safeTrim(buyerEmail),
          totalPointsCost,
          items: validatedItems.map((it) => ({
            productId: it.productId,
            qty: it.qty,
            pointsCost: it.pointsCost,
            inGameMoneyAmount: it.inGameMoneyAmount,
            redemptionDescription: it.redemptionDescription,
            deliveryCommands: it.deliveryCommands,
          })),
          // For auditing
          pointsBefore: current,
          pointsAfter: newBalance,
          paymentMethod: 'fade-points',
        }


        const queueJobs = validatedItems.flatMap((it) =>
          it.deliveryCommands.length
            ? it.deliveryCommands.map((command) => ({
              id: `${now.getTime()}-${Math.random().toString(36).slice(2, 10)}`,
              createdAt: now.toISOString(),
              mcName: safeTrim(mcName),
              command,
              productId: it.productId,
              qty: it.qty,
              // Worker can interpret these safely
              type: 'inGameCommand',
            }))
            : []
        )


        // Append to the legacy `purchases` array so profile purchase history can show this redemption.
        // Keep compatibility with existing UI keys, but mark the entry as points-based.
        const purchases = Array.isArray(uData?.purchases) ? uData.purchases : []

        const redemptionOrderId = `${userId}__${safeIdempotencyKey}`
        const alreadyInHistory = purchases.some((p) =>
          String(p?.type || p?.cat || '') === 'points_redemption'
            ? String(p?.paymentId || '') === safeIdempotencyKey
            : String(p?.paymentId || p?.paymentID || '') === safeIdempotencyKey
        )

        const redemptionPurchase = {
          id: ledgerEntry.id,
          productId: validatedItems[0]?.productId || '',
          name: `Fade Points Redemption${validatedItems.length > 1 ? ` (+${validatedItems.length - 1} items)` : ''}`,
          qty: 1,

          // Verified redemption
          verified: true,

          // Timestamp: keep as ISO string to match your current pages’ parsing.
          timestamp: now.toISOString(),

          // Stable fallback so profile sorting instantly places redemptions correctly
          // even before Firestore timestamp sync finishes.
          createdAt: now.getTime(),


          // Money-history compatibility
          subtotal: totalPointsCost,

          // Required FP fields
          pointsCost: totalPointsCost,
          currency: 'FP',
          type: 'points_redemption',

          // Existing keys that other parts of the UI may reference
          cat: 'money',
          price: totalPointsCost, // legacy UI fallback; FP renderer will override
          paymentMethod: 'fade-points',
          orderId: redemptionOrderId,
          paymentId: safeIdempotencyKey,

          redemptionLedgerId: ledgerEntry.id,
        }

        tx.update(userRef, {
          points: newBalance,
          redemptionLedger: [...ledger, ledgerEntry],
          deliveryQueue: [...deliveryQueue, ...queueJobs],
          purchases: alreadyInHistory ? purchases : [...purchases, redemptionPurchase],
          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),
        })


        return { ok: true, alreadyProcessed: false, pointsBalance: newBalance, totalPointsCost, redemptionId: ledgerEntry.id }
      })

    if (!result.ok) {
      return NextResponse.json({ error: result.error, pointsBalance: result.pointsBalance, totalPointsCost }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (e) {
    console.error('Fade points redemption error:', e)
    const message = e instanceof Error ? e.message : 'Redemption failed'
    // Avoid leaking internals; keep error readable for the client.
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


