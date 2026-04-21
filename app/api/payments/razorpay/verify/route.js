import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mcName, email, orderId, total } = await request.json()

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const signature = shasum.digest('hex')

    if (signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    // Fetch order to confirm captured
    const order = await razorpay.orders.fetch(razorpay_order_id)
    if (order.status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }

    // Here: Update Firebase purchase (extracted logic)
    // TODO: Move Firebase update to this endpoint or call from client
    // For now return success

    return NextResponse.json({ 
      success: true, 
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id 
    })

  } catch (error) {
    console.error('Razorpay verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
