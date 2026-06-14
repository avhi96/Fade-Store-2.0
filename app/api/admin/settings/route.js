import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'

import {
  FieldValue
} from 'firebase-admin/firestore'

import {
  requireAdmin
} from '@/lib/adminAuth'

export async function POST(request) {

  try {

    // ADMIN CHECK
    const adminCheck =
      await requireAdmin()

    if (!adminCheck.ok) {

      return NextResponse.json(
        {
          error: adminCheck.error,
        },
        {
          status: adminCheck.status,
        }
      )
    }

    const body = await request.json()

    await adminDb
      .collection('settings')
      .doc('store')
      .set(
        {
          ...body,

          updatedAt:
            FieldValue.serverTimestamp(),
        },

        {
          merge: true,
        }
      )

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Settings save error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to save settings',
      },
      { status: 500 }
    )
  }
}
