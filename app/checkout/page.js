'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/hooks/useCart"
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  User,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react"

import { db } from "@/lib/firebase"
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp 
} from "firebase/firestore"



export default function Checkout() {
  const router = useRouter()
  const { data: session } = useSession()

  const { cart, clearCart: clearCartItems } = useCart()
  const [localCart, setLocalCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")

  const [mcName, setMcName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const [scriptsLoaded, setScriptsLoaded] = useState({ razorpay: false, cashfree: false })
  const [orderData, setOrderData] = useState(null)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Prefill saved details
    if (session.user?.id) {
      const savedMcName = localStorage.getItem(`mcName_${session.user.id}`)
      const savedEmail = localStorage.getItem(`email_${session.user.id}`)
      if (savedMcName) setMcName(savedMcName)
      if (savedEmail) setEmail(savedEmail)
    }

    setLocalCart(cart)
    setLoading(false)
  }, [session, router, cart])

  // Load payment scripts
  useEffect(() => {
    const loadScript = (src, key) => {
      if (scriptsLoaded[key]) return

      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => setScriptsLoaded(prev => ({ ...prev, [key]: true }))
      script.onerror = () => setPaymentError('Failed to load payment SDK')
      document.head.appendChild(script)
    }

    loadScript('https://checkout.razorpay.com/v1/checkout.js', 'razorpay')
    loadScript('https://sdk.cashfree.com/js/v1/cashfree.js', 'cashfree')
  }, [])

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)

  const validate = () => {
    if (!mcName.trim()) return "Minecraft username is required"
    if (mcName.length < 3) return "Username too short"
    if (!/^[a-zA-Z0-9_]+$/.test(mcName)) return "Invalid Minecraft username"
    return ""
  }

  const handleCheckout = async () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    if (!cart.length || !session?.user?.id) {
      setError("No items or login required")
      return
    }

    setProcessing(true)
    setError('')
    setPaymentError('')

    try {
      const orderId = `${session.user.id}-${Date.now()}`

      // Create server order first
      const createRes = await fetch(`/api/payments/${paymentMethod}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total,
          currency: 'INR',
          mcName,
          email: email || '',
          orderId,
          paymentMethod 
        })
      })

      const orderData = await createRes.json()

      if (!createRes.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Open gateway SDK (common handler)
      if (paymentMethod === 'razorpay') {
        if (!window.Razorpay) throw new Error('Razorpay SDK not loaded')

        const options = {
          key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: 'Fade Web Store',
          description: `Purchase for ${mcName}`,
          image: '/FadeIcon.png',
          handler: async function (response) {
            await verifyPayment('razorpay', response, {mcName, email, orderId, total})
          },
          prefill: {
            name: mcName,
            email: email || ''
          },
          theme: {
            color: '#1e293b', // slate-800 dark
            backdropColor: '#0f172a' // slate-900
          },
          modal: {
            ondismiss: () => setProcessing(false)
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()

      } else if (paymentMethod === 'cashfree') {
        if (!window.CashFree) throw new Error('Cashfree SDK not loaded')
        
        window.CashFree.initiateAndLaunchCF(
          orderData.cf_session_id || orderData.sessionId, // from API
          {
            components: ['RZP'],
            onSuccess: async (data) => {
              await verifyPayment('cashfree', data, {mcName, email, orderId, total})
            },
            onError: (err) => {
              console.error('Cashfree error:', err)
              setPaymentError('Payment failed')
              setProcessing(false)
            }
          },
          {
            theme: {
              primary: '#1e293b',
              secondary: '#334155',
              background: '#0f172a'
            }
          }
        )
      }

    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Payment initiation failed')
      setProcessing(false)
    }
  }

  const verifyPayment = async (gateway, paymentData, orderDetails) => {
    try {
      const verifyRes = await fetch(`/api/payments/${gateway}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paymentData, ...orderDetails })
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed')
      }

      // NOW update Firebase (secure, after verify)
      const orderId = orderDetails.orderId
      const orderSubtotal = total
      for (const item of cart) {
        await updateDoc(doc(db, 'users', session.user.id), {
          purchases: arrayUnion({
            id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
            productId: item.id,
            ...item,
            mcName: orderDetails.mcName,
            buyerEmail: orderDetails.email || '',
            paymentMethod: gateway,
            orderId,
            paymentId: paymentData.razorpay_payment_id || paymentData.txId,
            subtotal: item.price * item.qty,
            verified: true
          }),
          totalSpent: arrayUnion(orderSubtotal),
          updatedAt: serverTimestamp()
        })
      }

      clearCartItems()
      setLocalCart([])

// Clear local form data only (keep Firebase data intact)
      if (session.user?.id) {
        localStorage.removeItem(`mcName_${session.user.id}`)
        localStorage.removeItem(`email_${session.user.id}`)
        setMcName('')
        setEmail('')
      }

      router.push(`/checkout/result?status=success&orderId=${orderId}&mcName=${encodeURIComponent(orderDetails.mcName)}&method=${gateway}&total=${total}`)

    } catch (err) {
      console.error('Verify error:', err)
      setPaymentError('Payment verified but order save failed')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading checkout...
      </div>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-white">

      {/* HEADER */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <ArrowLeft size={20} />
          Back to Store
        </button>
      </div>
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black tracking-wide" style={{ fontFamily: "Orbitron" }}>
          CHECKOUT
        </h1>
        <p className="text-gray-400 mt-3 text-sm">
          Complete your purchase and receive your rank instantly
        </p>
        <div className="w-24 h-[2px] mx-auto mt-4 bg-gradient-to-r from-blue-500 to-indigo-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="space-y-6">

          {/* USER INFO */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 tracking-wide">Player Details</h2>

            {/* MC USERNAME */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 uppercase">Minecraft Username *</label>
              <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500">
                <User size={16} />
                <input
                  value={mcName}
                  onChange={(e) => setMcName(e.target.value)}
                  placeholder="YourMinecraftName"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs text-gray-400 uppercase">Email (optional)</label>
              <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500">
                <Mail size={16} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-3">{error}</p>
            )}
          </div>

          {/* ORDER */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-lg mb-2 last:mb-0 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name} × {item.qty}</span>
                    <span className="font-bold text-blue-400">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-400">₹{total.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">

          <h2 className="text-lg font-bold mb-6">Payment</h2>

          <div className="space-y-3 mb-6">
            {["razorpay", "cashfree"].map(method => (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-xl cursor-pointer border transition flex items-center gap-3 ${
                  paymentMethod === method
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:border-blue-400/40"
                }`}
              >
                <CreditCard size={16} />
                <div>
                  <p className="text-sm font-semibold capitalize">{method}</p>
                  <p className="text-xs text-gray-400">
                    {method === "razorpay" ? "UPI / Cards" : "Banking / EMI"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TRUST BOX */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-xs text-gray-300 mb-6">
            ✔ Instant rank delivery after payment<br/>
            ✔ Works for online & offline servers<br/>
            ✔ Safe & encrypted checkout
          </div>

          {/* PAY */}
          <button
            onClick={handleCheckout}
            disabled={!cart.length || processing || !scriptsLoaded[paymentMethod]}
            className="w-full py-4 rounded-xl font-black tracking-wider text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {paymentError ? 'Error, Retry' : 'Opening Payment...'}
              </>
            ) : (
              <>
                <CreditCard className="inline mr-2" size={18} />
                PAY ₹{total.toFixed(2)} ({paymentMethod.toUpperCase()})
              </>
            )}
          </button>

          {paymentError && (
            <p className="text-red-400 text-xs text-center mt-3">{paymentError}</p>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
            <ShieldCheck size={14} />
            Secure gateway: {paymentMethod.toUpperCase()}
          </div>

        </div>

      </div>
    </section>
  )
}
