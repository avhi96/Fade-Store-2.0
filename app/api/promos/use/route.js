import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'

import {
  FieldValue
} from 'firebase-admin/firestore'

export async function POST(req) {

  try {

    const {
      code,
      userId,
    } = await req.json()

    const normalizedCode =
      String(code || '').trim().toUpperCase()

    const normalizedUserId =
      String(userId || '').trim()

    if (!normalizedCode || !normalizedUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing promo code or user ID',
        },
        { status: 400 }
      )
    }

    const settingsRef =
      adminDb
        .collection('settings')
        .doc('store')

    await adminDb.runTransaction(
      async (transaction) => {

        const settingsSnap =
          await transaction.get(settingsRef)

        if (!settingsSnap.exists) {
          throw new Error('Settings not found')
        }

        const settings =
          settingsSnap.data()

        const promoCodes =
          Array.isArray(settings?.promoCodes)
            ? settings.promoCodes
            : []

        const promoIndex =
          promoCodes.findIndex((promo) =>
            promo?.active !== false &&
            String(promo?.code || '').trim().toUpperCase() === normalizedCode
          )

        if (promoIndex === -1) {
          throw new Error('Invalid promo code')
        }

        const promo =
          promoCodes[promoIndex]

        const usedBy =
          Array.isArray(promo?.usedBy)
            ? promo.usedBy.map((id) => String(id))
            : []

        if (usedBy.includes(normalizedUserId)) {
          return
        }

        const maxUses =
          Number(promo?.maxUses || 0)

        if (maxUses > 0 && usedBy.length >= maxUses) {
          throw new Error('Promo fully used')
        }

        const updatedPromoCodes =
          promoCodes.map((item, index) =>
            index === promoIndex
              ? {
                  ...item,
                  usedBy:
                    [
                      ...usedBy,
                      normalizedUserId,
                    ],
                }
              : item
          )

        transaction.set(
          settingsRef,
          {
            promoCodes:
              updatedPromoCodes,
            updatedAt:
              FieldValue.serverTimestamp(),
          },
          {
            merge: true,
          }
        )
      }
    )

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Promo use failed:',
      error
    )

    return NextResponse.json({
      success: false,
      error:
        error?.message ||
        'Promo use failed',
    }, { status: 500 })
  }
}
