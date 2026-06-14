import { db } from './firebase'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  setDoc,
} from 'firebase/firestore'

function normalizeTimestamp(ts) {
  if (!ts) return 0
  if (typeof ts === 'number') return ts
  if (ts?.toMillis) return ts.toMillis()
  return 0
}

export function getOrderItems(order) {
  if (Array.isArray(order?.items) && order.items.length > 0) {
    return order.items
  }

  if (order?.product && typeof order.product === 'object') {
    return [order.product]
  }

  return []
}

export function getItemName(item) {
  return (
    item?.name ||
    item?.title ||
    item?.itemName ||
    item?.productName ||
    'Store Purchase'
  )
}

export function getOrderProductName(order) {
  const items = getOrderItems(order)

  if (items.length === 0) {
    return (
      order?.productName ||
      order?.name ||
      'Store Purchase'
    )
  }

  const firstName = getItemName(items[0])

  return items.length > 1
    ? `${firstName} +${items.length - 1} more`
    : firstName
}

export function getOrderCategory(order) {
  const firstItem = getOrderItems(order)[0]

  return (
    firstItem?.cat ||
    firstItem?.category ||
    order?.product?.cat ||
    order?.cat ||
    ''
  )
}

export function isFadePointsOrder(order) {
  const items = getOrderItems(order)

  return (
    order?.currency === 'FP' ||
    order?.type === 'points_redemption' ||
    order?.paymentMethod === 'fade-points' ||
    order?.paymentMethod === 'fade_points' ||
    items.some((item) =>
      item?.currency === 'FP' ||
      item?.type === 'points_redemption' ||
      item?.cat === 'money'
    )
  )
}

export function getItemAmount(item, { points = false } = {}) {
  const qty = Number(item?.qty ?? item?.quantity ?? 1)
  const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1

  if (points) {
    const pointsCost = Number(item?.pointsCost ?? item?.subtotal ?? item?.price ?? 0)
    return Number.isFinite(pointsCost) ? pointsCost * safeQty : 0
  }

  const subtotal = Number(item?.subtotal)
  if (Number.isFinite(subtotal)) {
    return subtotal
  }

  const price = Number(item?.price ?? item?.amount ?? item?.cost ?? 0)
  return Number.isFinite(price) ? price * safeQty : 0
}

export function getOrderAmount(order) {
  const orderSubtotal = Number(order?.subtotal ?? order?.total)

  if (Number.isFinite(orderSubtotal)) {
    return orderSubtotal
  }

  const points = isFadePointsOrder(order)

  return getOrderItems(order).reduce(
    (sum, item) => sum + getItemAmount(item, { points }),
    0
  )
}

export function getOrderBuyerName(order) {
  return (
    order?.discordName ||
    order?.discordUsername ||
    order?.userDisplayName ||
    order?.userName ||
    order?.mcName ||
    order?.buyerName ||
    'Unknown User'
  )
}

export async function getAllOrders() {

  try {

    const response =
      await fetch(
        '/api/admin/orders'
      )

    const data =
      await response.json()

    if (!data.success) {
      return []
    }

    return data.orders || []

  } catch (error) {

    console.error(
      'Get orders error:',
      error
    )

    return []
  }
}

export async function getOrderById(orderId) {

  try {

    const orderSnap = await getDoc(
      doc(db, 'orders', orderId)
    )

    if (!orderSnap.exists()) {
      return null
    }

    return {
      id: orderSnap.id,
      ...orderSnap.data(),
    }

  } catch (error) {

    console.error('Get order error:', error)

    return null
  }
}
async function recomputePointsFromPurchases(purchases) {
  const verifiedPurchases = (Array.isArray(purchases) ? purchases : []).filter((p) => p?.verified)
  const sorted = [...verifiedPurchases].sort(
    (a, b) => normalizeTimestamp(a.timestamp) - normalizeTimestamp(b.timestamp)
  )

  let points = 0
  let monthlyPoints = {}

  const { calcEarnedPointsBetweenBuckets, getMonthlyCapDefault, getUTCMonthKey } =
    await import('@/lib/fadePoints')

  let prevTotalSpent = 0
  const monthlyCap = getMonthlyCapDefault()

  for (const p of sorted) {
    const sub = Number(p?.subtotal ?? (Number(p?.price || 0) * Number(p?.qty || 1)))
    const newTotalSpent = prevTotalSpent + (Number.isFinite(sub) ? sub : 0)
    const earnedRaw = calcEarnedPointsBetweenBuckets({
      prevTotalSpent,
      newTotalSpent
    })

    const monthKey = getUTCMonthKey(
      p.timestamp ? new Date(p.timestamp.toDate?.() ?? p.timestamp) : new Date()
    )
    const prevMonthPoints = Number(monthlyPoints?.[monthKey] || 0)
    const remaining = Math.max(0, monthlyCap - prevMonthPoints)
    const earnedCapped = Math.min(earnedRaw, remaining)

    points += earnedCapped
    monthlyPoints[monthKey] = prevMonthPoints + earnedCapped
    prevTotalSpent = newTotalSpent
  }

  return { points, monthlyPoints }
}

export async function addMockPurchaseToUser({ userId, product }) {
  try {
    if (!userId) return { ok: false, error: 'Missing userId' }
    if (!product || typeof product !== 'object') return { ok: false, error: 'Missing product' }

    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return { ok: false, error: 'User not found' }

    const userData = userSnap.data()
    const purchases = Array.isArray(userData.purchases) ? userData.purchases : []

    const safeProduct = {
      ...product,
      id: product.id || product.orderId || String(Date.now()),
      qty: Number(product.qty || 1),
      price: Number(product.price || 0),
      subtotal:
        Number.isFinite(Number(product.subtotal))
          ? Number(product.subtotal)
          : Number(product.price || 0) * Number(product.qty || 1),
      verified: product.verified ?? true,
      timestamp: product.timestamp ?? new Date(),
      orderId: product.orderId ?? `${userId}-${product.id || String(Date.now())}`
    }

    // Add to purchases
    await updateDoc(userRef, {
      updatedAt: new Date()
    })

    await setDoc(
      doc(db, 'orders', safeProduct.orderId),
      {
        orderId: safeProduct.orderId,

        userId,

        userName:
          userData.name ||
          userData.username ||
          'Unknown',

        items: [safeProduct],

        subtotal: safeProduct.subtotal,
        total: safeProduct.subtotal,

        paymentMethod: 'mock',

        verified: true,

        createdAt: safeProduct.timestamp,
      }
    )

    // Recompute points/monthlyPoints from verified purchases
    const newPurchases = [...purchases, safeProduct]
    const { points, monthlyPoints } = await recomputePointsFromPurchases(newPurchases)

    await updateDoc(userRef, {
      points,
      monthlyPoints,
      updatedAt: new Date()
    })

    return { ok: true }
  } catch (error) {
    console.error('Add mock purchase error:', error)
    return { ok: false, error: 'Add mock purchase failed' }
  }
}

export async function deleteOrderById(orderId) {

  try {

    if (!orderId) {
      return {
        ok: false,
        error: 'Missing orderId',
      }
    }

    await deleteDoc(
      doc(db, 'orders', orderId)
    )

    return {
      ok: true,
    }

  } catch (error) {

    console.error('Delete order error:', error)

    return {
      ok: false,
      error: 'Delete failed',
    }
  }
}
