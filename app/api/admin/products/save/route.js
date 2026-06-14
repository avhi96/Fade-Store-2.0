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

    const {
      editId,
      data,
    } = body

    if (editId) {

      await adminDb
        .collection('products')
        .doc(editId)
        .set(
          {
            ...data,
            updatedAt:
              FieldValue.serverTimestamp(),
          },
          {
            merge: true,
          }
        )

    } else {

      await adminDb
        .collection('products')
        .add({
          ...data,
          createdAt:
            FieldValue.serverTimestamp(),
          updatedAt:
            FieldValue.serverTimestamp(),
        })
    }

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Save product error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to save product',
      },
      { status: 500 }
    )
  }
}
