import { NextResponse } from 'next/server'

import crypto from 'crypto'

import {
  processVerifiedPayment
} from '@/lib/serverPayments'

export async function POST(request) {

  try {

    const rawBody =
      await request.text()

    const signature =
      request.headers.get(
        'x-razorpay-signature'
      )

    // VERIFY WEBHOOK SIGNATURE
    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env
            .RAZORPAY_WEBHOOK_SECRET
        )
        .update(rawBody)
        .digest('hex')

    if (
      expectedSignature !== signature
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid webhook signature',
        },
        { status: 400 }
      )
    }

    const body =
      JSON.parse(rawBody)

    console.log(
      'Razorpay webhook:',
      body
    )

    // ONLY PAYMENT CAPTURED
    if (
      body?.event !==
      'payment.captured'
    ) {

      return NextResponse.json({
        success: true,
        ignored: true,
      })
    }

    const payment =
      body?.payload?.payment?.entity

    const notes =
      payment?.notes || {}

    // PROCESS PAYMENT
    await processVerifiedPayment({

      userId:
        notes.userId,

      orderId:
        payment.order_id,

      paymentId:
        payment.id,

      paymentMethod:
        'razorpay',

      mcName:
        notes.mcName ||
        'Unknown',

      buyerEmail:
        payment.email || '',

      cartSnapshot:
        JSON.parse(
          notes.cartSnapshot || '[]'
        ),

      snapshotTotal:
        Number(
          notes.snapshotTotal || 0
        ),
    })

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Razorpay webhook error:',
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