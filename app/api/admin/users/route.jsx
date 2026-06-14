import { NextResponse }
  from 'next/server'

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
        .collection('users')
        .get()

    const users = []

    snapshot.forEach((doc) => {
      const userData =
        doc.data()

      users.push({

        id: doc.id,

        ...userData,

        discordId:
          userData?.discordId ||
          doc.id,
      })
    })

    return NextResponse.json({
      success: true,
      users,
    })

  } catch (error) {

    console.error(
      'Users API error:',
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
