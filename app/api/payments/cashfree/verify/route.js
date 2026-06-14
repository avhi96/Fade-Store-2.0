import { NextResponse } from 'next/server'

import { processVerifiedPayment }
  from '@/lib/serverPayments'

const SANDBOX_BASE_URL =
  'https://sandbox.cashfree.com/pg'

const PRODUCTION_BASE_URL =
  'https://api.cashfree.com/pg'

function getBaseUrl() {

  return process.env.CASHFREE_ENV === 'PRODUCTION'
    ? PRODUCTION_BASE_URL
    : SANDBOX_BASE_URL
}

export async function POST(request) {

  try {

    const body = await request.json()

    const {

      order_id,

      orderId,

      userId,

      mcName,

      email,

      cartSnapshot,

      snapshotTotal,

    } = body

    const finalOrderId =
      order_id || orderId

    if (!finalOrderId) {

      return NextResponse.json(
        {
          success: false,
          error: 'Missing order ID',
        },
        { status: 400 }
      )
    }

    // VERIFY WITH CASHFREE
    const response = await fetch(
      `${getBaseUrl()}/orders/${finalOrderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id':
            process.env.CASHFREE_APP_ID,

          'x-client-secret':
            process.env.CASHFREE_SECRET_KEY,

          'x-api-version': '2023-08-01',
        },
      }
    )

    const data = await response.json()

    console.log(
      'Cashfree Verify Response:',
      data
    )

    if (!response.ok) {

      return NextResponse.json(
        {
          success: false,
          error:
            data.message ||
            'Verification failed',
        },
        { status: 500 }
      )
    }

    // PAYMENT NOT COMPLETE
    if (data.order_status !== 'PAID') {

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

        orderId: finalOrderId,

        paymentId:
          data.cf_order_id ||
          data.payment_session_id ||
          '',

        paymentMethod: 'cashfree',

        mcName,

        buyerEmail: email || '',

        cartSnapshot,

        snapshotTotal,
      })

    return NextResponse.json({

      success: true,

      orderId: finalOrderId,

      earnedPoints:
        result.earnedPoints || 0,

      alreadyProcessed:
        result.alreadyProcessed || false,
    })

  } catch (error) {

    console.log(
      'Cashfree verify error:',
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