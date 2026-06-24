import admin from 'firebase-admin'

import { createDelivery }
  from "@/lib/delivery"

import { adminDb }
  from '@/lib/firebase-admin'

import {
  calcEarnedPointsBetweenBuckets,
  getMonthlyCapDefault,
  getUTCMonthKey,
} from '@/lib/fadePoints'

function normalizeCartPurchaseItems({
  cartSnapshot,
  orderId,
  paymentId,
  paymentMethod,
  mcName,
  buyerEmail,
  timestamp,
}) {

  const items =
    Array.isArray(cartSnapshot)
      ? cartSnapshot
      : []

  if (items.length === 0) {
    return [
      {
        orderId,
        paymentId,
        paymentMethod,
        mcName,
        buyerEmail,
        name: 'Store Purchase',
        productName: 'Store Purchase',
        qty: 1,
        price: 0,
        subtotal: 0,
        verified: true,
        timestamp,
      },
    ]
  }

  return items.map((item) => {

    const qty =
      Number(item?.qty ?? item?.quantity ?? 1)

    const safeQty =
      Number.isFinite(qty) && qty > 0
        ? qty
        : 1

    const price =
      Number(item?.price ?? item?.amount ?? item?.cost ?? 0)

    const safePrice =
      Number.isFinite(price)
        ? price
        : 0

    const subtotal =
      Number(item?.subtotal ?? (safePrice * safeQty))

    const safeSubtotal =
      Number.isFinite(subtotal)
        ? subtotal
        : safePrice * safeQty

    const productName =
      item?.name ||
      item?.title ||
      item?.productName ||
      item?.itemName ||
      'Store Purchase'

    return {
      id:
        item?.id ||
        item?.productId ||
        `${orderId}-${productName}`,
      productId:
        item?.productId ||
        item?.id ||
        '',
      orderId,
      paymentId,
      paymentMethod,
      mcName,
      buyerEmail,
      name:
        productName,
      productName,
      itemName:
        productName,
      qty:
        safeQty,
      price:
        safePrice,
      subtotal:
        safeSubtotal,
      cat:
        item?.cat ||
        '',
      icon:
        item?.icon ||
        '',
      imageUrl:
        item?.imageUrl ||
        '',
      perks:
        item?.perks ||
        [],
      verified: true,
      timestamp,
    }
  })
}

export async function processVerifiedPayment({

  userId,

  orderId,

  paymentId,

  paymentMethod,

  mcName,

  buyerEmail,

  cartSnapshot,

  snapshotTotal,
}) {

  const orderRef =
    adminDb.collection('orders').doc(orderId)

  // DUPLICATE PROTECTION
  const existingOrder =
    await orderRef.get()

  if (existingOrder.exists) {

    return {
      success: true,
      alreadyProcessed: true,
      earnedPoints: 0,
    }
  }

  const userRef =
    adminDb.collection('users').doc(userId)
    let purchaseEntries = []

  await adminDb.runTransaction(
    async (transaction) => {

      const userSnap =
        await transaction.get(userRef)

      let userData = {}

      if (!userSnap.exists) {

        userData = {
          points: 0,
          totalSpent: 0,
          monthlyPoints: {},
          purchases: [],
        }

        transaction.set(userRef, {

          id: userId,

          createdAt:
            admin.firestore.FieldValue.serverTimestamp(),

          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),

          ...userData,
        })

      } else {

        userData = userSnap.data()
      }

      const prevTotalSpent =
        Number(userData?.totalSpent || 0)

      const newTotalSpent =
        prevTotalSpent + snapshotTotal

      // POINTS
      const earnedNowRaw =
        calcEarnedPointsBetweenBuckets({
          prevTotalSpent,
          newTotalSpent,
        })

      const monthKey =
        getUTCMonthKey(new Date())

      const monthlyCap =
        getMonthlyCapDefault()

      const prevMonthPoints =
        Number(
          userData?.monthlyPoints?.[monthKey] || 0
        )

      const remaining =
        Math.max(
          0,
          monthlyCap - prevMonthPoints
        )

      const earnedPoints =
        Math.min(
          earnedNowRaw,
          remaining
        )

      const purchaseTimestamp =
        new Date().toISOString()

      purchaseEntries =
        normalizeCartPurchaseItems({
          cartSnapshot,
          orderId,
          paymentId,
          paymentMethod,
          mcName,
          buyerEmail,
          timestamp:
            purchaseTimestamp,
        })

      // SAVE ORDER
      transaction.set(orderRef, {

        orderId,

        userId,

        mcName,

        buyerEmail,

        paymentMethod,

        paymentId,

        subtotal: snapshotTotal,

        total: snapshotTotal,

        items: cartSnapshot,

        verified: true,

        earnedPoints,

        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      })

      // USER UPDATE
      transaction.update(userRef, {

        purchases:
          admin.firestore.FieldValue.arrayUnion(
            ...purchaseEntries
          ),

        totalSpent:
          admin.firestore.FieldValue.increment(
            snapshotTotal
          ),

        points:
          admin.firestore.FieldValue.increment(
            earnedPoints
          ),

        [`monthlyPoints.${monthKey}`]:
          admin.firestore.FieldValue.increment(
            earnedPoints
          ),

        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      })
    }
  )

  // Create delivery job
  await createDelivery({

    orderId,

    userId,

    mcName,

    items: purchaseEntries,

  })

  const savedOrder =
    await orderRef.get()

  return {

    success: true,

    alreadyProcessed: false,

    earnedPoints:
      savedOrder.data()?.earnedPoints || 0,
  }
}
