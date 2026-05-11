import { db } from './firebase'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore'

function normalizeTimestamp(ts) {
  if (!ts) return 0
  if (typeof ts === 'number') return ts
  if (ts?.toMillis) return ts.toMillis()
  return 0
}

export async function getAllOrders() {
  try {
    const usersSnap = await getDocs(
      query(collection(db, 'users'), orderBy('updatedAt', 'desc'))
    )

    const orders = []
    usersSnap.forEach((userDoc) => {
      const userData = userDoc.data()
      userData.purchases?.forEach((purchase) => {
        orders.push({
          orderId: `${userDoc.id}-${purchase.id || Date.now()}`,
          userId: userDoc.id,
          userName: userData.name || userData.username || 'Unknown',
          userPoints: userData.points || 0,
          product: purchase,
          timestamp: purchase.timestamp || userData.updatedAt
        })
      })
    })

    return orders.sort(
      (a, b) => normalizeTimestamp(b.timestamp) - normalizeTimestamp(a.timestamp)
    )
  } catch (error) {
    console.error('Get orders error:', error)
    return []
  }
}

export async function getOrderById(orderId) {
  try {
    // Parse orderId to find userId and purchase id (best effort)
    const [userId, purchaseId] = orderId.split('-')
    const userDoc = await getDoc(doc(db, 'users', userId))

    if (!userDoc.exists()) return null

    const userData = userDoc.data()
    const purchases = Array.isArray(userData.purchases) ? userData.purchases : []

    const purchaseIndex = purchases.findIndex(
      (p) => (purchaseId && p?.id === purchaseId) || p?.orderId === orderId
    )

    if (purchaseIndex === -1) return null

    const order = purchases[purchaseIndex]

    return {
      orderId,
      userId,
      userName: userData.name || 'Unknown',
      userPoints: userData.points || 0,
      product: order,
      timestamp: order.timestamp || userData.updatedAt
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
      purchases: arrayUnion(safeProduct),
      updatedAt: new Date()
    })

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
    const parts = String(orderId || '').split('-')
    const purchaseId = parts.pop()
    const userId = parts.join('-')
    if (!userId || !purchaseId) return { ok: false, error: 'Invalid orderId' }

    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return { ok: false, error: 'User not found' }

    const userData = userSnap.data()
    const purchases = Array.isArray(userData.purchases) ? userData.purchases : []

    // Remove ONLY the single purchase that matches this specific orderId.
    const matchIndex = purchases.findIndex((p) => {
      const pOrderId = p?.orderId
      if (pOrderId && pOrderId === orderId) return true

      const pId = p?.id
      if (pId && `${userId}-${pId}` === orderId) return true

      return false
    })

    if (matchIndex === -1) {
      return { ok: false, error: 'Order not found in user purchases' }
    }

    const filtered = purchases.filter((_, idx) => idx !== matchIndex)

    // Recompute points from remaining verified purchases (so UI stays consistent)
    const { points, monthlyPoints } = await recomputePointsFromPurchases(filtered)

    await updateDoc(userRef, {
      purchases: filtered,
      points,
      monthlyPoints,
      updatedAt: new Date()
    })

    return { ok: true }
  } catch (error) {
    console.error('Delete order error:', error)
    return { ok: false, error: 'Delete failed' }
  }
}
