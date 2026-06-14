import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'
import {
  requireAdmin
} from '@/lib/adminAuth'

export async function GET() {

  try {

    const adminCheck =
      await requireAdmin()

    if (!adminCheck.ok) {

      return NextResponse.json(
        {
          error:
            adminCheck.error,
        },
        {
          status:
            adminCheck.status,
        }
      )
    }

    const snapshot =
      await adminDb
        .collection('orders')
        .orderBy(
          'createdAt',
          'desc'
        )
        .get()

    const orders = []

    snapshot.forEach((doc) => {

      orders.push({

        id: doc.id,

        ...doc.data(),
      })
    })

    const userIds =
      Array.from(
        new Set(
          orders
            .map((order) => String(order?.userId || '').trim())
            .filter(Boolean)
        )
      )

    const userEntries =
      await Promise.all(
        userIds.map(async (userId) => {

          const userSnap =
            await adminDb
              .collection('users')
              .doc(userId)
              .get()

          return [
            userId,
            userSnap.exists ? userSnap.data() : null,
          ]
        })
      )

    const usersById =
      new Map(
        userEntries
          .filter(([, user]) => user)
      )

    const enrichedOrders =
      orders.map((order) => {

        const user =
          usersById.get(
            String(order?.userId || '').trim()
          )

        return {
          ...order,
          discordName:
            user?.name ||
            order.discordName ||
            order.discordUsername ||
            '',
          discordImage:
            user?.image ||
            order.discordImage ||
            '',
        }
      })

    return NextResponse.json({
      success: true,
      orders:
        enrichedOrders,
    })

  } catch (error) {

    console.error(
      'Orders API error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    )
  }
}
