import { NextResponse } from 'next/server'

const SANDBOX_BASE_URL = 'https://sandbox.cashfree.com/pg'
const PRODUCTION_BASE_URL = 'https://api.cashfree.com/pg'

function getBaseUrl() {
  return process.env.CASHFREE_ENV === 'PRODUCTION' ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL
}

export async function POST(request) {
  try {
    const {

      amount,

      email,

      orderId,

      userId,

      mcName,

      cartSnapshot,

      snapshotTotal,

      customerPhone = '9999999999',

    } = await request.json()

    const appId = process.env.CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY

    if (!appId || !secretKey) {
      return NextResponse.json({ error: 'Cashfree credentials not configured' }, { status: 500 })
    }

    const parsedAmount = typeof amount === 'string' ? Number(amount) : amount
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Cashfree PG create order endpoint (API version used by cashfree-pg)
    const apiVersion = '2023-08-01'

    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/orders`

    // Cashfree PG Create Order uses X-Client-Id / X-Client-Secret headers
    const payload = {

      order_amount: parsedAmount,

      order_currency: 'INR',

      order_note: `Order ${orderId}`,

      order_tags: {
        userId,
        mcName,
      },

      customer_details: {

        customer_id: userId,

        customer_phone: String(customerPhone),

        customer_email:
          email || 'test@test.com',
      },

      cartSnapshot,

      snapshotTotal,

      order_meta: {

        return_url:
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/result?order_id={order_id}`,

        notify_url:
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/cashfree/verify`,
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': apiVersion,
        'x-client-id': appId,
        'x-client-secret': secretKey,
      },
      body: JSON.stringify(payload),
    })


    const dataText = await res.text()
    let data
    try {
      data = JSON.parse(dataText)
    } catch (error) {
      console.log(error)
      data = { raw: dataText }
    }

    if (!res.ok) {
      // Safe diagnostics: return only Cashfree-provided error/message fields (no secrets)
      const maybeJson = typeof data === 'object' && data ? data : {}
      const safeError = maybeJson?.error || maybeJson?.message || maybeJson?.raw || 'Failed to create order'
      return NextResponse.json({ error: safeError }, { status: 500 })
    }


    // Normalize to what frontend expects: needs payment_session_id / cf_session_id equivalent.
    // Common Cashfree responses: payment_session_id, order_id, etc.
    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

