import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(request) {
  try {
    const {

      amount,

      currency = 'INR',

      mcName,

      email,

      orderId,

      paymentMethod,

      userId,

      cartSnapshot,

      snapshotTotal,

    } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: orderId || `order_${Date.now()}`,
      notes: {

        userId,

        mcName,

        email,

        paymentMethod,

        cartSnapshot:
          JSON.stringify(
            cartSnapshot || []
          ),

        snapshotTotal:
          String(snapshotTotal || 0),
      }
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    })

  } catch (error) {
    console.error('Razorpay create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
