import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

function parseInteger(value, { min = 0, max = 1000000000 } = {}) {
  const n = Number(value)
  if (!Number.isFinite(n)) return null
  const i = Math.trunc(n)
  if (i < min || i > max) return null
  return i
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { cart, mcName, buyerEmail } = body || {}

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ ok: false, error: 'Missing cart items' }, { status: 400 })
    }

    // Only validate shapes here (real product pointsCost validation happens in redemption endpoint).
    const validated = cart.map((it) => {
      const productId = String(it?.id || it?.productId || '')
      const qty = parseInteger(it?.qty ?? it?.quantity ?? 1, { min: 1, max: 100 })
      return { productId, qty }
    })

    for (const v of validated) {
      if (!v.productId) {
        return NextResponse.json({ ok: false, error: 'Invalid productId in cart' }, { status: 400 })
      }
      if (v.qty === null) {
        return NextResponse.json({ ok: false, error: 'Invalid qty in cart' }, { status: 400 })
      }
    }

    const safeMcName = String(mcName ?? '').trim()
    const safeEmail = String(buyerEmail ?? '').trim()
    if (safeMcName.length < 3 || safeMcName.length > 32) {
      return NextResponse.json({ ok: false, error: 'Invalid mcName length' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, validatedCart: validated, mcName: safeMcName, buyerEmail: safeEmail })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Validation failed' }, { status: 400 })
  }
}

