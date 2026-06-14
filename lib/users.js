import {
  adminDb
} from '@/lib/firebase-admin'

import {
  requireAdmin
} from '@/lib/adminAuth'

import {
  enrichPurchasesWithOrders
} from '@/lib/user-purchases'

export async function getUser(userId) {

  try {

    if (!userId) {
      return null
    }

    const adminCheck =
      await requireAdmin()

    if (!adminCheck.ok) {
      return null
    }

    const doc =
      await adminDb
        .collection('users')
        .doc(userId)
        .get()

    if (!doc.exists) {
      return null
    }

    const userData =
      doc.data()

    const purchases =
      await enrichPurchasesWithOrders(
        userId,
        userData?.purchases
      )

    return {
      id: doc.id,
      ...userData,
      purchases,
    }

  } catch (error) {

    console.error(
      'Get user error:',
      error
    )

    return null
  }
}
