import { NextRequest, NextResponse } from 'next/server'
import CashfreePG from 'cashfree-pg'

CashfreePG.configure({
  appId: process.env.CASHFREE_APP_ID,
  secretKey: process.env.CASHFREE_SECRET_KEY,
  env: 'TEST'  // Change to 'PROD' for live
})

export async function POST(request) {
  try {
    const { amount, mcName, email, orderId, paymentMethod, customerPhone = '9999999999' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const orderData = {
      orderAmount: amount,
      orderCurrency: 'INR',
      orderNote: `Order ${orderId}`,
      customerDetails: {
        customerId: orderId,
        customerPhone,
        customerEmail: email,
      },
      orderMeta: {
        returnUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/result`,
        notifyUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/webhook`,
      }
    }

    const response = await CashfreePG.OrderInterface.createOrder(orderData)

    return NextResponse.json({
      orderId: response.orderId,
      cf_session_id: response.cfSessionId || response.sessionId,
      ...response,
      // Frontend needs
      cf_app_id: process.env.CASHFREE_APP_ID,
    })

  } catch (error) {
    console.error('Cashfree create error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
