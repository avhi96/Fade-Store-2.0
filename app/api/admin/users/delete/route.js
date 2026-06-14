import { NextResponse }
  from 'next/server'

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
          error:
            adminCheck.error,
        },
        {
          status:
            adminCheck.status,
        }
      )
    }

    const {
      userId,
    } = await request.json()

    if (!userId) {

      return NextResponse.json(
        {
          success: false,
          error: 'Missing user ID',
        },
        { status: 400 }
      )
    }

    await adminDb
      .collection('users')
      .doc(userId)
      .delete()

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Delete user error:',
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