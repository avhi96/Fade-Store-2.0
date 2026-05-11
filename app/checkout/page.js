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
  const [didMount, setDidMount] = useState(false)
  const [cartChecked, setCartChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")

  const [mcName, setMcName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  // Promo (temporary client-side 10% discount; real validation later)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState("")

  const [scriptsLoaded, setScriptsLoaded] = useState({ razorpay: false, cashfree: false })
  const [orderData, setOrderData] = useState(null)
  const [paymentError, setPaymentError] = useState('')

  // Handle session redirect separately — don't couple it to cart state
  useEffect(() => {
    if (session === null) {
      // session=null means unauthenticated (undefined means still loading)
      router.push("/login")
    }
  }, [session, router])

  // Prefill saved details once session is known
  useEffect(() => {
    if (!session?.user?.id) return
    const savedMcName = localStorage.getItem(`mcName_${session.user.id}`)
    const savedEmail = localStorage.getItem(`email_${session.user.id}`)
    if (savedMcName) setMcName(savedMcName)
    if (savedEmail) setEmail(savedEmail)
  }, [session])

  // Wait for client-side mount + session to resolve before deciding checkout UI.
  useEffect(() => {
    setDidMount(true)
  }, [])

  useEffect(() => {
    if (session === undefined) return
    // Stop loader after auth is resolved; cart may arrive shortly after,
    // but we won't render the checkout until didMount is true.
    setLoading(false)
  }, [session])

  // If user tries to open checkout without items, block access.
  // IMPORTANT: don’t redirect immediately on first mount because `useCart()` can be
  // briefly empty during hydration/navigation. Instead, apply a short grace period.
  useEffect(() => {
    if (!didMount) return
    if (session === undefined) return
    if (!session?.user?.id) return
    if (cartChecked) return

    const graceMs = 400

    setCartChecked(true)

    const t = setTimeout(() => {
      if (!cart || cart.length === 0) {
        router.replace('/store')
      }
    }, graceMs)

    return () => clearTimeout(t)
  }, [didMount, session, router, cart, cartChecked])


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

  // Guard: sometimes `cart` can briefly be empty/undefined during hydration.
  // Keep summary stable by normalizing to an array.
  const safeCart = Array.isArray(cart) ? cart : []
  const total = safeCart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)

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

    if (!safeCart.length || !session?.user?.id) {
      setError("No items or login required")
      return
    }

    // IMPORTANT: take a stable snapshot so gateway callbacks can't race with cart clearing
    const cartSnapshot = safeCart.map((item) => ({ ...item }))
    const snapshotTotal = cartSnapshot.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)

    // Promo (temporary client-side 10% discount; real validation later)
    const discount = promoApplied ? snapshotTotal * 0.1 : 0
    const payableTotal = Math.max(0, snapshotTotal - discount)

    setProcessing(true)
    setError('')
    setPaymentError('')

    try {
      const orderId = `${session.user.id}-${Date.now()}`

      // Create server order first (gateway amount must be payableTotal after promo)
      const createRes = await fetch(`/api/payments/${paymentMethod}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: payableTotal,
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
            await verifyPayment(
              'razorpay',
              response,
              { mcName, email, orderId, total: snapshotTotal },
              cartSnapshot,
              snapshotTotal
            )
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
              await verifyPayment('cashfree', data, {mcName, email, orderId, total: snapshotTotal}, cartSnapshot, snapshotTotal)
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

  const verifyPayment = async (gateway, paymentData, orderDetails, cartSnapshot, snapshotTotal) => {
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
      const orderSubtotal = snapshotTotal
      const paymentId = paymentData.razorpay_payment_id || paymentData.txId || ''

      // ---- Load user for points/rank calc + idempotency ----
      const userRef = doc(db, 'users', session.user.id)
      const userSnap = await (await import('firebase/firestore')).getDoc(userRef)
      const userData = userSnap.exists() ? userSnap.data() : {}

      const purchasesArr = Array.isArray(userData?.purchases) ? userData.purchases : []

      // Idempotency: if this payment/order was already saved, don't award points again.
      const alreadyProcessed = purchasesArr.some((p) => {
        const pOrderId = p?.orderId || p?.orderID
        const pPaymentId = p?.paymentId || p?.payment_id
        return (orderId && pOrderId === orderId) || (paymentId && pPaymentId === paymentId)
      })

      // Sum only verified purchases to represent previous spend
      const prevVerifiedSpend = purchasesArr.reduce((sum, p) => {
        if (!p?.verified) return sum
        const sub = Number(p?.subtotal ?? (Number(p?.price || 0) * Number(p?.qty || 1)))
        return sum + (Number.isFinite(sub) ? sub : 0)
      }, 0)

      // New total spend after this order
      const newVerifiedSpend = prevVerifiedSpend + orderSubtotal

      // ---- Points calc with monthly spending cap ----
      const {
        calcEarnedPointsBetweenBuckets,
        getMonthlyCapDefault,
        getUTCMonthKey,
      } = await import('@/lib/fadePoints')

      const earnedNowRaw = calcEarnedPointsBetweenBuckets({
        prevTotalSpent: prevVerifiedSpend,
        newTotalSpent: newVerifiedSpend,
        // cap handled below
      })

      const monthKey = getUTCMonthKey(new Date())
      const monthlyCap = getMonthlyCapDefault() // points cap per month
      const prevMonthPoints = Number(userData?.monthlyPoints?.[monthKey] || 0)
      const remaining = Math.max(0, monthlyCap - prevMonthPoints)
      const earnedNowCapped = Math.min(earnedNowRaw, remaining)

      // Current points stored
      const prevPoints = Number(userData?.points || 0)
      const newPoints = prevPoints + (alreadyProcessed ? 0 : earnedNowCapped)

      // ---- Save purchases (always) ----
      for (const item of cartSnapshot) {
        await updateDoc(userRef, {
          purchases: arrayUnion({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId: item.id,
            ...item,
            mcName: orderDetails.mcName,
            buyerEmail: orderDetails.email || '',
            paymentMethod: gateway,
            orderId,
            paymentId,
            subtotal: item.price * item.qty,
            verified: true
          }),
          totalSpent: arrayUnion(orderSubtotal),
          updatedAt: serverTimestamp()
        })
      }

      // ---- Award points + update monthly cap tracking (only once) ----
      if (!alreadyProcessed && earnedNowCapped > 0) {
        await updateDoc(userRef, {
          points: newPoints,
          monthlyPoints: {
            ...(userData?.monthlyPoints || {}),
            [monthKey]: prevMonthPoints + earnedNowCapped
          },
          updatedAt: serverTimestamp()
        })
      }

      clearCartItems()

      // Clear local form data only (keep Firebase data intact)
      if (session.user?.id) {
        localStorage.removeItem(`mcName_${session.user.id}`)
        localStorage.removeItem(`email_${session.user.id}`)
        setMcName('')
        setEmail('')
      }

      router.push(`/checkout/result?status=success&orderId=${orderId}&mcName=${encodeURIComponent(orderDetails.mcName)}&method=${gateway}&total=${snapshotTotal}`)

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
          className="flex items-center cursor-pointer gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <ArrowLeft size={20} />
          Back to Store
        </button>
      </div>

      {/* TITLE */}
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

            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3">
              {safeCart.map((item, index) => (
                <div
                  key={item.id || item.productId || index}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg mb-2 last:mb-0 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">
                      {(item.name || item.title || "Unknown Item")} × {(item.qty || item.quantity || 1)}
                    </span>
                    <span className="font-bold text-blue-400">
                      ₹{(
                        Number(item.price ?? item.cost ?? 0) *
                        Number(item.qty ?? item.quantity ?? 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Payment</h2>

          <div className="space-y-3 mb-6">
            {["razorpay", "cashfree"].map((method) => (
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
            ✔ Instant rank delivery after payment<br />
            ✔ Works for online & offline servers<br />
            ✔ Safe & encrypted checkout
          </div>

          {/* PROMO (temporary client-side 10% off) */}
          <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Promo Code</h3>
              <span className="text-xs text-gray-400">10% off</span>
            </div>

            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value)
                  setPromoError("")
                  setPromoApplied(false)
                }}
                placeholder="Enter promo code"
                className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 outline-none text-sm focus-within:border-blue-500"
              />
              <button
                onClick={() => {
                  const code = promoCode.trim()
                  if (!code) {
                    setPromoError("Enter a promo code")
                    setPromoApplied(false)
                    return
                  }
                  setPromoApplied(true)
                  setPromoError("")
                }}
                disabled={!promoCode.trim()}
                className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition"
              >
                Apply
              </button>
            </div>

            {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}

            {promoApplied && (
              <div className="mt-3 text-xs text-gray-300">
                Promo applied: <span className="text-blue-300 font-bold">-10%</span>
              </div>
            )}
          </div>

          {/* PAY */}
          <button
            onClick={handleCheckout}
            disabled={!safeCart.length || processing || !scriptsLoaded[paymentMethod]}
            className="w-full py-4 rounded-xl cursor-pointer font-black tracking-wider text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {paymentError ? "Error, Retry" : "Opening Payment..."}
              </>
            ) : (
              <>
                <CreditCard className="inline mr-2" size={18} />
                PAY ₹{Math.max(0, total - (promoApplied ? total * 0.1 : 0)).toFixed(2)} ({paymentMethod.toUpperCase()})
              </>
            )}
          </button>

          {paymentError && <p className="text-red-400 text-xs text-center mt-3">{paymentError}</p>}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
            <ShieldCheck size={14} />
            Secure gateway: {paymentMethod.toUpperCase()}
          </div>
        </div>
      </div>
    </section>
  )
}
