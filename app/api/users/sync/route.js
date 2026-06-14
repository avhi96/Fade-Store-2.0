import { NextResponse } from 'next/server'

import {
  adminDb
} from '@/lib/firebase-admin'

import {
  FieldValue
} from 'firebase-admin/firestore'

export async function POST(request) {

  try {

    const body =
      await request.json()

    const {
      id,
      name,
      image,
      email,
    } = body

    if (!id) {

      return NextResponse.json(
        {
          success: false,
          error: 'Missing user ID',
        },
        { status: 400 }
      )
    }

    const userRef =
      adminDb
        .collection('users')
        .doc(id)

    const existing =
      await userRef.get()

    // CREATE USER
    if (!existing.exists) {

      await userRef.set({

        id,

        discordId:
          id,

        name:
          name || '',

        image:
          image || '',

        email:
          email || '',

        points: 0,

        totalSpent: 0,

        monthlyPoints: {},

        purchases: [],

        role: 'user',

        isAdmin: false,

        createdAt:
          FieldValue.serverTimestamp(),

        updatedAt:
          FieldValue.serverTimestamp(),
      })

    }

    // UPDATE USER
    else {

      await userRef.set(

        {

          name:
            name || '',

          discordId:
            id,

          image:
            image || '',

          email:
            email || '',

          updatedAt:
            FieldValue.serverTimestamp(),
        },

        {
          merge: true,
        }
      )
    }

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'User sync error:',
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
