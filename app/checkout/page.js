'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/hooks/useCart"
import { getUser } from "@/lib/client-users"
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  User,
  Mail,
  Loader2,
} from "lucide-react"

export default function Checkout() {
  const router = useRouter()
  const { data: session } = useSession()

  const { cart, clearCart: clearCartItems } = useCart()
  const [didMount, setDidMount] = useState(false)
  const [cartChecked, setCartChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  // const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [paymentMethod, setPaymentMethod] = useState("cashfree")

  const [mcName, setMcName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  // Promo (temporary client-side 10% discount; real validation later)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)

  const [paymentError, setPaymentError] = useState('')

  const [userData, setUserData] = useState(null)

  // Handle session redirect separately — don't couple it to cart state
  useEffect(() => {
    if (session === null) {
      // session=null means unauthenticated (undefined means still loading)
      router.push("/login")
    }
  }, [session, router])

  useEffect(() => {
    async function loadUser() {
      if (!session?.user?.id) return

      const data = await getUser(session.user.id)
      setUserData(data)
    }

    loadUser()
  }, [session])

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
    const loadScript = (src) => {
      const existing = document.querySelector(`script[src="${src}"]`)

      if (existing) return

      const script = document.createElement("script")
      script.src = src
      script.async = true

      script.onerror = (err) => {
        console.error(err)
        setPaymentError("Failed to load payment SDK")
      }

      document.head.appendChild(script)
    }

    // loadScript('https://checkout.razorpay.com/v1/checkout.js')
    loadScript('https://sdk.cashfree.com/js/v3/cashfree.js')
  }, [])

  // Guard: sometimes `cart` can briefly be empty/undefined during hydration.
  // Keep summary stable by normalizing to an array.
  const safeCart = Array.isArray(cart) ? cart : []
  const total = safeCart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)

  const cartIsMoneyOnly = safeCart.length > 0 && safeCart.every((it) => it?.cat === 'money')

  const totalPointsRequired = safeCart.reduce((sum, item) => {
    if (item?.cat !== 'money') return sum

    const qty = Number(item.qty ?? 1)
    const pointsCost = Number(item.pointsCost ?? 0)

    return sum + (pointsCost * qty)
  }, 0)

  const userPoints = Number(userData?.points || 0)

  const hasEnoughPoints = userPoints >= totalPointsRequired

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
      setError('No items or login required')
      return
    }

    // IMPORTANT: take a stable snapshot so callbacks can't race with cart clearing
    const cartSnapshot = safeCart.map((item) => ({ ...item }))

    const isMoneyOnly = cartSnapshot.every((it) => it?.cat === 'money')

    // ---- Fade Points redemption flow ----
    if (isMoneyOnly) {

      setProcessing(true)
      setError('')
      setPaymentError('')

      try {
        const redemptionRes = await fetch('/api/redemptions/fade-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cart: cartSnapshot,
            mcName,
            buyerEmail: email || '',
            // stable idempotency per checkout attempt so re-renders don't create new server requests
            idempotencyKey: `${session?.user?.id}-${mcName}-${cartSnapshot.map(i => i.id || i.productId).join(',')}`,
          }),
        })

        const data = await redemptionRes.json()

        if (!redemptionRes.ok || !data.success) {
          throw new Error(data?.error || 'Redemption failed')
        }

        if (promoApplied && promoCode.trim()) {

          await fetch('/api/promos/use', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: promoCode.trim().toUpperCase(),
              userId: session?.user?.id,
            }),
          })
        }

        clearCartItems()

        // redirect to success page
        router.push(
          `/checkout/result?status=success&method=fade-points&redemptionId=${encodeURIComponent(
            data?.redemptionId || ''
          )}&totalPointsCost=${encodeURIComponent(String(data?.totalPointsCost ?? 0))}&mcName=${encodeURIComponent(
            mcName
          )}`
        )
      } catch (e) {
        console.error('Redemption error:', e)
        setPaymentError(e?.message || 'Redemption failed')
      } finally {
        setProcessing(false)
      }

      return
    }

    // ---- Normal gateway flow (existing) ----
    const snapshotTotal = cartSnapshot.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)

    // Promo (temporary client-side 10% discount; real validation later)
    const discount = promoDiscount
    const payableTotal = Math.max(0, snapshotTotal - discount)

    setProcessing(true)
    setError('')
    setPaymentError('')

    try {
      const orderId = `${session.user.id}-${Date.now()}`

      // const allowedMethods = ["razorpay", "cashfree"]
      const allowedMethods = ["cashfree"]

      if (!allowedMethods.includes(paymentMethod)) {
        throw new Error("Invalid payment method")
      }

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

          paymentMethod,

          userId: session?.user?.id,

          cartSnapshot,

          snapshotTotal,
        }),
      })

      const orderData = await createRes.json()

      if (!createRes.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Open gateway SDK (common handler)
      if (paymentMethod === 'razorpay') {
        if (!window.Razorpay) {

          await new Promise((resolve, reject) => {

            const existing = document.querySelector(
              'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            )

            if (existing && window.Razorpay) {
              resolve(true)
              return
            }

            const script = document.createElement('script')

            script.src = 'https://checkout.razorpay.com/v1/checkout.js'

            script.onload = () => resolve(true)

            script.onerror = () => reject(
              new Error('Failed to load Razorpay SDK')
            )

            document.body.appendChild(script)
          })
        }

        const options = {
          key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: 'Fade Store',
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
            email: email || '',
          },
          theme: {
            color: '#1e293b', // slate-800 dark
            backdropColor: '#0f172a', // slate-900
          },
          modal: {
            ondismiss: () => setProcessing(false),
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else if (paymentMethod === 'cashfree') {

        if (typeof window === "undefined" || !window.Cashfree) {
          throw new Error('Cashfree SDK not loaded')
        }

        const cashfree = window.Cashfree({
          mode: 'sandbox',
        })

        const result = await cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          redirectTarget: '_modal',

          appearance: {
            width: '425px',
            height: '700px',
          },

          theme: {
            color: '#1e293b',
          },
        })

        console.log('Cashfree Result:', result)

        // SUCCESS
        if (result?.error == null) {

          await verifyPayment(
            'cashfree',
            {
              order_id: orderData.order_id,
            },
            {
              mcName,
              email,
              orderId,
              total: snapshotTotal
            },
            cartSnapshot,
            snapshotTotal
          )

        } else {

          setPaymentError(result.error.message || 'Payment failed')
          setProcessing(false)
        }
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Payment initiation failed')
      setProcessing(false)
    }
  }

useEffect(() => {
  if (!session?.user?.id) return

  const mcKey = `mcName_${session.user.id}`
  const emailKey = `email_${session.user.id}`

  if (localStorage.getItem(mcKey) !== mcName) {
    localStorage.setItem(mcKey, mcName)
  }

  if (localStorage.getItem(emailKey) !== email) {
    localStorage.setItem(emailKey, email)
  }
}, [mcName, email, session])


  const verifyPayment = async (gateway, paymentData, orderDetails, cartSnapshot, snapshotTotal) => {
    try {
      const verifyRes = await fetch(`/api/payments/${gateway}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          ...paymentData,

          ...orderDetails,

          userId: session?.user?.id,

          cartSnapshot,

          snapshotTotal,
        })
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed')
      }

      if (promoApplied && promoCode.trim()) {
        const promoUseRes =
          await fetch('/api/promos/use', {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              code:
                promoCode.trim().toUpperCase(),
              userId:
                session.user.id,
            }),
          })

        if (!promoUseRes.ok) {
          console.warn(
            'Promo usage was not recorded'
          )
        }
      }

      clearCartItems()

      if (session.user?.id) {
        localStorage.removeItem(`mcName_${session.user.id}`)

        localStorage.removeItem(
          `email_${session.user.id}`
        )

        setMcName('')
        setEmail('')
      }


      router.push(

        `/checkout/result?status=success&orderId=${verifyData.orderId || orderDetails.orderId
        }&mcName=${encodeURIComponent(
          orderDetails.mcName
        )}&method=${gateway}&total=${snapshotTotal}&earnedPoints=${verifyData.earnedPoints || 0
        }`
      )

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
              {safeCart.map((item, index) => {
                const qty = Number(item.qty ?? item.quantity ?? 1)
                if (item?.cat === 'money') {
                  const linePoints = Number(item.pointsCost ?? 0) * qty
                  return (
                    <div
                      key={item.id || item.productId || index}
                      className="p-3 bg-white/5 border border-white/10 rounded-lg mb-2 last:mb-0 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          {(item.name || item.title || 'Unknown Item')} × {qty}
                        </span>
                        <span className="font-bold text-cyan-300">
                          {linePoints} Fade Points
                        </span>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={item.id || item.productId || index}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg mb-2 last:mb-0 hover:bg-white/10 transition-all"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">
                        {(item.name || item.title || 'Unknown Item')} × {qty}
                      </span>
                      <span className="font-bold text-blue-400">
                        ₹{(Number(item.price ?? item.cost ?? 0) * qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Payment</h2>

          {!cartIsMoneyOnly ? (
            <div className="space-y-3 mb-6">
              {[
                // "razorpay",
                "cashfree"
              ].map((method) => (
                <div
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-xl cursor-pointer border transition flex items-center gap-3 ${paymentMethod === method
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
          ) : (
            <div className="mb-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-sm">Redeem with Fade Points</h3>
                  <p className="text-xs text-gray-400 mt-1">Points will be deducted instantly (money-only cart).</p>
                </div>

                <div className="text-right">
                  <div className="text-[0.7rem] uppercase tracking-[0.15em] text-cyan-300">Your total points</div>
                  <div className="text-lg font-black text-white/95">
                    {Number(userData?.points || 0).toLocaleString()}
                  </div>
                  {cartIsMoneyOnly && !hasEnoughPoints && (
                    <div className="mt-2 text-xs text-red-400 font-medium">
                      You need {(totalPointsRequired - userPoints).toLocaleString()} more Fade Points to redeem this purchase.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* TRUST BOX */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-xs text-gray-300 mb-6">
            ✔ Instant rank delivery after payment<br />
            ✔ Works for online & offline servers<br />
            ✔ Safe & encrypted checkout
          </div>

          {/* PROMO (temporary client-side 10% off) - hide for Fade Points redemption */}
          {!cartIsMoneyOnly && (
            <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Promo Code</h3>
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
                  onClick={async () => {

                    const code = promoCode.trim().toUpperCase()

                    if (!code) {
                      setPromoError("Enter a promo code")
                      setPromoApplied(false)
                      return
                    }

                    try {

                      const res = await fetch('/api/promos/validate', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          code,
                          userId: session?.user?.id,
                          total,
                        }),
                      })

                      const data = await res.json()

                      if (!res.ok || !data.success) {
                        throw new Error(data.error || 'Invalid promo code')
                      }

                      setPromoApplied(true)
                      setPromoError("")
                      setPromoDiscount(data.discountAmount)

                    } catch (err) {

                      setPromoApplied(false)
                      setPromoDiscount(0)
                      setPromoError(err.message)
                    }
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
                  Promo applied:
                  <span className="text-blue-300 font-bold ml-1">

                    {promoDiscount > 0
                      ? `-₹${promoDiscount.toFixed(2)}`
                      : 'Applied'}

                  </span>
                </div>
              )}
            </div>
          )}

          {/* PAY */}
          <button
            onClick={handleCheckout}
            disabled={
              !safeCart.length ||
              processing ||
              (cartIsMoneyOnly && !hasEnoughPoints)
            }
            className={cartIsMoneyOnly
              ? "w-full py-4 rounded-xl cursor-pointer font-black tracking-wider text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] transition shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              : "w-full py-4 rounded-xl cursor-pointer font-black tracking-wider text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"}
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {paymentError ? "Error, Retry" : cartIsMoneyOnly ? "Redeeming..." : "Opening Payment..."}
              </>
            ) : (
              <>
                {cartIsMoneyOnly ? (
                  <span className="inline mr-2 text-cyan-200"></span>
                ) : (
                  <CreditCard className="inline mr-2" size={18} />
                )}
                {cartIsMoneyOnly
                  ? 'REDEEM WITH FADE POINTS'
                  : `PAY ₹${Math.max(0, total - promoDiscount).toFixed(2)} (${paymentMethod.toUpperCase()})`}
              </>
            )}
          </button>


          {paymentError && <p className="text-red-400 text-xs text-center mt-3">{paymentError}</p>}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
            <ShieldCheck size={14} />
            {cartIsMoneyOnly ? 'Secure redemption with Fade Points' : `Secure gateway: ${paymentMethod.toUpperCase()}`}
          </div>
        </div>
      </div>
    </section>
  )
}
