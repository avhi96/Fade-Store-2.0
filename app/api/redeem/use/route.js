import { NextResponse } from 'next/server'

import { db } from '@/lib/firebase'

import {
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'

import {
  redeemRateLimit
} from '@/lib/rateLimit'

export async function POST(req) {
  try {

    const {
      code,
      userId,
    } = await req.json()

    if (!code || !userId) {

      return NextResponse.json(
        {
          success: false,
          error: 'Missing fields',
        },
        { status: 400 }
      )
    }
    const ip =
      req.headers
        .get('x-forwarded-for')
        ?.split(',')[0]
        ?.trim() || 'unknown'

    const { success } =
      await redeemRateLimit.limit(ip)

    if (!success) {

      return NextResponse.json(
        {
          success: false,
          error:
            'Too many requests',
        },
        { status: 429 }
      )
    }

    const codeId =
      String(code).toUpperCase()

    const redeemRef =
      doc(db, 'redeemCodes', codeId)

    let successMessage = ''

    await runTransaction(
      db,

      async (transaction) => {

        const redeemSnap =
          await transaction.get(redeemRef)

        if (!redeemSnap.exists()) {

          throw new Error(
            'Invalid redeem code'
          )
        }

        const redeem =
          redeemSnap.data()

        if (redeem?.active === false) {

          throw new Error(
            'Redeem code disabled'
          )
        }

        const usedBy =
          Array.isArray(redeem.usedBy)
            ? redeem.usedBy
            : []

        // already used
        if (usedBy.includes(userId)) {

          throw new Error(
            'Code already redeemed'
          )
        }

        const maxUses =
          Number(redeem.maxUses || 0)

        // usage limit
        if (
          maxUses > 0 &&
          usedBy.length >= maxUses
        ) {

          throw new Error(
            'Redeem code fully used'
          )
        }

        transaction.update(
          redeemRef,

          {
            usedBy: [
              ...usedBy,
              userId,
            ],

            updatedAt:
              serverTimestamp(),
          }
        )

        successMessage =
          `Redeemed ${redeem.reward || 'reward'
          } successfully!`
      }
    )

    return NextResponse.json({
      success: true,
      message: successMessage,
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      {
        success: false,
        error:
          err.message ||
          'Redeem failed',
      },
      { status: 500 }
    )
  }
}