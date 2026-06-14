import { NextResponse } from 'next/server'

import Razorpay from 'razorpay'

import crypto from 'crypto'

import {
  processVerifiedPayment
} from '@/lib/serverPayments'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {

  try {

    const body = await request.json()

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      userId,

      mcName,

      email,

      cartSnapshot,

      snapshotTotal,

    } = body

    // VERIFY SIGNATURE
    const shasum =
      crypto.createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )

    shasum.update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )

    const signature =
      shasum.digest('hex')

    if (signature !== razorpay_signature) {

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid signature',
        },
        { status: 400 }
      )
    }

    // VERIFY PAYMENT
    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      )

    if (payment.status !== 'captured') {

      return NextResponse.json(
        {
          success: false,
          error: 'Payment not completed',
        },
        { status: 400 }
      )
    }

    // PROCESS PAYMENT
    const result =
      await processVerifiedPayment({

        userId,

        orderId: razorpay_order_id,

        paymentId: razorpay_payment_id,

        paymentMethod: 'razorpay',

        mcName,

        buyerEmail: email || '',

        cartSnapshot,

        snapshotTotal,
      })

    return NextResponse.json({

      success: true,

      orderId: razorpay_order_id,

      paymentId: razorpay_payment_id,

      earnedPoints:
        result.earnedPoints || 0,

      alreadyProcessed:
        result.alreadyProcessed || false,
    })

  } catch (error) {

    console.error(
      'Razorpay verify error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          'Verification failed',
      },
      { status: 500 }
    )
  }
}