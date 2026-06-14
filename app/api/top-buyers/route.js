import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'

import {
  ADMIN_IDS
} from '@/lib/admins'

export const dynamic = 'force-dynamic'

function isAdminUser(userId, userData) {
  return userData?.isAdmin === true ||
    userData?.role === 'admin' ||
    ADMIN_IDS.includes(String(userId || '')) ||
    ADMIN_IDS.includes(String(userData?.id || '')) ||
    ADMIN_IDS.includes(String(userData?.discordId || ''))
}

function isFadePointsPurchase(purchase) {
  return (
    purchase?.currency === 'FP' ||
    purchase?.type === 'points_redemption' ||
    purchase?.paymentMethod === 'fade-points' ||
    purchase?.paymentMethod === 'fade_points' ||
    purchase?.cat === 'money'
  )
}

function getPurchaseAmount(purchase) {
  const subtotal =
    Number(purchase?.subtotal)

  if (Number.isFinite(subtotal)) {
    return subtotal
  }

  const price =
    Number(purchase?.price ?? purchase?.amount ?? purchase?.cost ?? 0)

  const qty =
    Number(purchase?.qty ?? purchase?.quantity ?? 1)

  const safePrice =
    Number.isFinite(price)
      ? price
      : 0

  const safeQty =
    Number.isFinite(qty) && qty > 0
      ? qty
      : 1

  return safePrice * safeQty
}

function getPurchaseTime(purchase) {
  const value =
    purchase?.timestamp ||
    purchase?.createdAt ||
    purchase?.updatedAt

  if (!value) return 0

  if (typeof value?.toMillis === 'function') {
    return value.toMillis()
  }

  if (typeof value?.seconds === 'number') {
    return value.seconds * 1000
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? value
      : 0
  }

  if (typeof value === 'string') {
    const parsed =
      Date.parse(value)

    return Number.isFinite(parsed)
      ? parsed
      : 0
  }

  return 0
}

function isCurrentMonthPurchase(purchase) {
  const time =
    getPurchaseTime(purchase)

  if (!time) return false

  const date =
    new Date(time)

  const now =
    new Date()

  return date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth()
}

export async function GET(request) {

  try {

    const { searchParams } =
      new URL(request.url)

    const requestedLimit =
      Number(searchParams.get('limit') || 5)

    const safeRequestedLimit =
      Number.isFinite(requestedLimit)
        ? requestedLimit
        : 5

    const limit =
      Math.min(
        20,
        Math.max(
          1,
          safeRequestedLimit
        )
      )

    const period =
      searchParams.get('period') === 'month'
        ? 'month'
        : 'all'

    const snapshot =
      await adminDb
        .collection('users')
        .get()

    const buyers = []

    snapshot.forEach((doc) => {
      const user =
        doc.data()

      if (isAdminUser(doc.id, user)) {
        return
      }

      const purchases =
        Array.isArray(user?.purchases)
          ? user.purchases
          : []

      const visiblePurchases =
        purchases.filter((purchase) => {
          if (!purchase) return false
          if (purchase?.verified === false) return false
          if (isFadePointsPurchase(purchase)) return false
          if (period === 'month' && !isCurrentMonthPurchase(purchase)) return false
          return true
        })

      if (visiblePurchases.length === 0) {
        return
      }

      const total =
        visiblePurchases.reduce(
          (sum, purchase) =>
            sum + getPurchaseAmount(purchase),
          0
        )

      if (total <= 0) {
        return
      }

      buyers.push({
        userId:
          doc.id,
        userName:
          user?.name ||
          user?.discordName ||
          user?.discordUsername ||
          user?.userDisplayName ||
          user?.userName ||
          'Unknown',
        total,
        orders:
          visiblePurchases.length,
      })
    })

    buyers.sort(
      (a, b) =>
        b.total - a.total ||
        b.orders - a.orders
    )

    return NextResponse.json(
      {
        success: true,
        buyers:
          buyers.slice(0, limit),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )

  } catch (error) {

    console.error(
      'Top buyers API error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        buyers: [],
      },
      { status: 500 }
    )
  }
}
