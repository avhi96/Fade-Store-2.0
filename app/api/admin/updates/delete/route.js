import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'

import {
  requireAdmin
} from '@/lib/adminAuth'

export async function POST(request) {

  try {

    const adminCheck =
      await requireAdmin()

    if (!adminCheck.ok) {

      return NextResponse.json(
        {
          success: false,
          error:
            adminCheck.error,
        },
        {
          status:
            adminCheck.status,
        }
      )
    }

    const body =
      await request.json()

    if (!body?.id) {

      return NextResponse.json(
        {
          success: false,
          error: 'Missing update ID',
        },
        { status: 400 }
      )
    }

    await adminDb
      .collection('updates')
      .doc(body.id)
      .delete()

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Delete update error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to delete update',
      },
      { status: 500 }
    )
  }
}
