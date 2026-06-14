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

    const {
      editId,
      update,
    } = body

    if (!update?.title || !update?.desc) {

      return NextResponse.json(
        {
          success: false,
          error: 'Missing update title or description',
        },
        { status: 400 }
      )
    }

    const safeUpdate = {
      title:
        String(update.title || '').trim(),
      type:
        String(update.type || 'announcement').trim(),
      desc:
        String(update.desc || '').trim(),
      date:
        String(update.date || '').trim(),
      updatedAt:
        FieldValue.serverTimestamp(),
    }

    if (editId) {

      await adminDb
        .collection('updates')
        .doc(editId)
        .set(
          safeUpdate,
          {
            merge: true,
          }
        )

    } else {

      await adminDb
        .collection('updates')
        .add({
          ...safeUpdate,
          createdAt:
            FieldValue.serverTimestamp(),
        })
    }

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Save update error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Failed to save update',
      },
      { status: 500 }
    )
  }
}
