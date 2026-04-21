"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import {
  CheckCircle2,
  XCircle,
  Download,
  Mail,
  User,
  Clock,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  ShoppingCart
} from 'lucide-react'

export default function PaymentResult() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { itemCount } = useCart()

  const [loading, setLoading] = useState(true)
  const status = searchParams.get('status')
  const orderId = searchParams.get('orderId') || ''
  const mcName = decodeURIComponent(searchParams.get('mcName') || '')
  const paymentMethod = searchParams.get('method') || ''
  const totalAmount = parseFloat(searchParams.get('total') || '0')
  const paymentId = searchParams.get('paymentId') || searchParams.get('txId') || 'N/A'

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  const downloadInvoice = () => {
    const text = `
FADE WEB STORE - RECEIPT

Order ID: ${orderId}
Player: ${mcName}
Gateway: ${paymentMethod.toUpperCase()}
Transaction ID: ${paymentId}
Total: ₹${totalAmount.toFixed(2)}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

✅ Status: COMPLETED
✅ Instant delivery activated

Thank you for your purchase!
    `
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${orderId.slice(-8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // LOADING
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <h1 className="text-4xl font-black" style={{ fontFamily: "Orbitron" }}>
            Processing Payment
          </h1>
          <p className="text-gray-400 text-sm">
            Delivering your ranks to <span className="text-blue-400">{mcName}</span>
          </p>
        </div>
      </section>
    )
  }

  // FAILED
  if (status !== "success") {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 text-white">
        <div className="max-w-lg w-full bg-white/5 border border-red-500/30 rounded-2xl p-10 text-center backdrop-blur-xl">

          <XCircle className="mx-auto text-red-400 mb-6" size={60} />

          <h1 className="text-3xl font-black mb-2">Payment Failed</h1>
          <p className="text-gray-400 mb-8 text-sm">
            Your transaction could not be completed
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push('/store')}
              className="w-full py-3 border border-white/20 rounded-xl"
            >
              Back to Store
            </button>
          </div>
        </div>
      </section>
    )
  }

  // SUCCESS
  return (
    <section className="min-h-screen py-20 text-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <CheckCircle2 className="mx-auto text-blue-400 mb-4" size={60} />
          <h1 className="text-5xl font-black" style={{ fontFamily: "Orbitron" }}>
            PURCHASE COMPLETE
          </h1>
          <p className="text-gray-400 mt-3 text-sm">
            Your rank has been delivered instantly
          </p>
          <div className="w-24 h-[2px] mx-auto mt-4 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* DETAILS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

            <h2 className="font-bold mb-6 text-lg">
              Order #{orderId.slice(-6).toUpperCase()}
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <User size={14} /> Player
                </span>
                <span className="font-mono">{mcName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <CreditCard size={14} /> Gateway
                </span>
                <span className="capitalize font-mono">{paymentMethod}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock size={14} /> Date
                </span>
                <span className="text-xs">{new Date().toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <ShoppingBag size={14} /> Order ID
                </span>
                <span className="font-mono text-xs">{orderId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <CreditCard size={14} /> Transaction ID
                </span>
                <span className="font-mono text-xs">{paymentId}</span>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-400">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* TRUST */}
            <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} />
                Instant Delivery Enabled
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <ShoppingCart size={14} className="text-emerald-400" />
                <span>Cart cleared ({itemCount} items) - Ready for next purchase</span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-4">

            <button
              onClick={downloadInvoice}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Invoice
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="w-full py-4 border border-white/20 rounded-xl"
            >
              View Profile
            </button>

            <button
              onClick={() => router.push('/store')}
              className="w-full py-4 border border-white/20 rounded-xl"
            >
              Continue Shopping
            </button>

            <div className="mt-6 p-4 border border-yellow-500/20 rounded-xl text-center text-sm text-gray-300">
              <Mail className="mx-auto mb-2 text-yellow-400" size={20} />
              Need help? Contact support if your rank is missing.
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}