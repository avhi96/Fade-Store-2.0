import { NextRequest, NextResponse } from 'next/server'
import CashfreePG from 'cashfree-pg'

CashfreePG.configure({
  appId: process.env.CASHFREE_APP_ID,
  secretKey: process.env.CASHFREE_SECRET_KEY,
  env: 'TEST'
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId, txId, paymentMode, amount } = body

    // Verify payment status with Cashfree
    const response = await CashfreePG.OrderInterface.fetchOrderDetails(orderId)

    if (response.orderStatus === 'PAID' && parseFloat(response.orderAmount) === parseFloat(amount)) {
      return NextResponse.json({ 
        success: true, 
        orderId, 
        txId: txId || response.txId 
      })
    } else {
      return NextResponse.json({ success: false, error: 'Payment not confirmed' }, { status: 400 })
    }

  } catch (error) {
    console.error('Cashfree verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
