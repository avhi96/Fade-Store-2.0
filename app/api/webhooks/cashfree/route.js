import { NextResponse } from 'next/server'

import {
  processVerifiedPayment
} from '@/lib/serverPayments'

export async function POST(request) {

  try {

    const body = await request.json()

    console.log(
      'Cashfree webhook:',
      body
    )

    const order =
      body?.data?.order || {}

    const customer =
      order?.customer_details || {}

    // SUCCESS ONLY
    if (
      order?.order_status !== 'PAID'
    ) {

      return NextResponse.json({
        success: true,
        ignored: true,
      })
    }

    // PROCESS PAYMENT
    await processVerifiedPayment({

      userId:
        customer.customer_id,

      orderId:
        order.order_id,

      paymentId:
        order.cf_order_id ||
        '',

      paymentMethod:
        'cashfree',

      mcName:
        customer.customer_name ||
        'Unknown',

      buyerEmail:
        customer.customer_email ||
        '',

      cartSnapshot:
        order.cartSnapshot || [],

      snapshotTotal:
        Number(order.order_amount || 0),
    })

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.error(
      'Cashfree webhook error:',
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