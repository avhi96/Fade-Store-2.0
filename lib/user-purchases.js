import {
  adminDb
} from '@/lib/firebase-admin'

function hasPurchaseName(purchase) {
  return Boolean(
    purchase?.name ||
    purchase?.title ||
    purchase?.itemName ||
    purchase?.productName
  )
}

function getItemName(item) {
  return (
    item?.name ||
    item?.title ||
    item?.itemName ||
    item?.productName ||
    'Store Purchase'
  )
}

function normalizeOrderItemsForPurchase(purchase, order) {

  const items =
    Array.isArray(order?.items)
      ? order.items
      : []

  if (items.length === 0) {
    return [
      {
        ...purchase,
        name:
          purchase?.name ||
          order?.product?.name ||
          order?.productName ||
          'Store Purchase',
        productName:
          purchase?.productName ||
          order?.product?.name ||
          order?.productName ||
          'Store Purchase',
        mcName:
          purchase?.mcName ||
          order?.mcName ||
          null,
        buyerEmail:
          purchase?.buyerEmail ||
          order?.buyerEmail ||
          null,
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

    const name =
      getItemName(item)

    return {
      ...purchase,
      id:
        item?.id ||
        item?.productId ||
        purchase?.id ||
        purchase?.orderId ||
        '',
      productId:
        item?.productId ||
        item?.id ||
        purchase?.productId ||
        '',
      name,
      productName:
        name,
      itemName:
        name,
      qty:
        safeQty,
      price:
        safePrice,
      subtotal:
        safeSubtotal,
      cat:
        item?.cat ||
        purchase?.cat ||
        '',
      icon:
        item?.icon ||
        purchase?.icon ||
        '',
      imageUrl:
        item?.imageUrl ||
        purchase?.imageUrl ||
        '',
      perks:
        item?.perks ||
        purchase?.perks ||
        [],
      mcName:
        purchase?.mcName ||
        order?.mcName ||
        null,
      buyerEmail:
        purchase?.buyerEmail ||
        order?.buyerEmail ||
        null,
    }
  })
}

export async function enrichPurchasesWithOrders(userId, purchases) {

  const list =
    Array.isArray(purchases)
      ? purchases
      : []

  const needsOrderData =
    list.some((purchase) =>
      !hasPurchaseName(purchase) &&
      (purchase?.orderId || purchase?.orderID)
    )

  if (!needsOrderData) {
    return list
  }

  const ordersSnapshot =
    await adminDb
      .collection('orders')
      .where('userId', '==', userId)
      .get()

  const ordersById =
    new Map()

  ordersSnapshot.forEach((orderDoc) => {
    const order =
      {
        id: orderDoc.id,
        ...orderDoc.data(),
      }

    if (order?.orderId) {
      ordersById.set(String(order.orderId), order)
    }

    ordersById.set(String(orderDoc.id), order)
  })

  return list.flatMap((purchase) => {

    if (hasPurchaseName(purchase)) {
      return [purchase]
    }

    const orderKey =
      String(
        purchase?.orderId ||
        purchase?.orderID ||
        ''
      )

    const order =
      ordersById.get(orderKey)

    if (!order) {
      return [
        {
          ...purchase,
          name:
            purchase?.type === 'points_redemption'
              ? 'Fade Points Redemption'
              : 'Store Purchase',
          productName:
            purchase?.type === 'points_redemption'
              ? 'Fade Points Redemption'
              : 'Store Purchase',
        },
      ]
    }

    return normalizeOrderItemsForPurchase(
      purchase,
      order
    )
  })
}
