import { NextResponse }
  from 'next/server'

import { getServerSession }
  from 'next-auth'

import { authOptions }
  from '@/lib/auth'

import {
  adminDb
} from '@/lib/firebase-admin'

import {
  enrichPurchasesWithOrders
} from '@/lib/user-purchases'

export async function GET() {

  try {

    const session =
      await getServerSession(
        authOptions
      )

    if (!session?.user?.discordId) {

      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const userId =
      session.user.discordId

    const doc =
      await adminDb
        .collection('users')
        .doc(userId)
        .get()

    if (!doc.exists) {

      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      )
    }

    const userData =
      doc.data()

    const purchases =
      await enrichPurchasesWithOrders(
        userId,
        userData?.purchases
      )

    return NextResponse.json({

      success: true,

      user: {
        id: doc.id,
        ...userData,
        purchases,
      },
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    )
  }
}
