import admin from "firebase-admin"
import { adminDb } from "@/lib/firebase-admin"

export async function createDelivery({
  orderId,
  userId,
  mcName,
  items,
}) {

  const deliveryRef =
    adminDb
      .collection("deliveries")
      .doc(orderId)

  await deliveryRef.set({

    orderId,

    userId,

    mcName,

    items,

    status: "pending",

    attempts: 0,

    logs: [],

    createdAt:
      admin.firestore.FieldValue.serverTimestamp(),

    updatedAt:
      admin.firestore.FieldValue.serverTimestamp(),

  })

  return true
}