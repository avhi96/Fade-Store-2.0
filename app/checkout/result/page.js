"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { getFadeRankIndex, getPointsPer100ByRankIndex, FADE_RANKS } from '@/lib/fadePoints'
import { useSession } from 'next-auth/react'
import { getUser } from '@/lib/client-users'

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
  const { data: session, status: sessionStatus } = useSession()

  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  const status = searchParams.get('status')
  const orderId = searchParams.get('orderId') || ''
  const mcName = decodeURIComponent(searchParams.get('mcName') || '')
  const paymentMethod = searchParams.get('method') || ''
  const totalAmount = parseFloat(searchParams.get('total') || '0')
  const paymentId = searchParams.get('paymentId') || searchParams.get('txId') || 'N/A'
  useEffect(() => {
    console.log("USER DATA:", userData)
  }, [userData])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  useEffect(() => {
    async function loadUser() {
      try {
        if (!session?.user?.id) return
        const data = await getUser(session.user.id)
        setUserData(data)
      } catch (e) {
        // ignore; UI will fallback to query totalAmount
      }
    }
    if (sessionStatus !== 'loading') loadUser()
  }, [session?.user?.id, sessionStatus])

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

  const totalSpentFromUser = (() => {
    const purchasesArr = Array.isArray(userData?.purchases) ? userData.purchases : []
    const verifiedSum = purchasesArr.reduce((sum, p) => {
      if (!p?.verified) return sum
      const sub = Number(p?.subtotal ?? (Number(p?.price || 0) * Number(p?.qty || 1)))
      return sum + (Number.isFinite(sub) ? sub : 0)
    }, 0)
    return verifiedSum
  })()

  // Fallback while userData isn't loaded yet
  const totalSpent = totalSpentFromUser > 0 ? totalSpentFromUser : totalAmount

  const rankIndex = getFadeRankIndex(totalSpent)
  const rankNames = ['Member', 'Stateer', 'Silver', 'Gold', 'Platinum', 'Diamond']
  const rankColors = {
    0: 'from-gray-600 to-gray-400',
    1: 'from-blue-500 to-cyan-500',
    2: 'from-gray-400 to-gray-200',
    3: 'from-amber-500 to-orange-500',
    4: 'from-indigo-500 to-blue-500',
    5: 'from-purple-500 to-pink-500',
  }

  const rankName = rankNames[rankIndex] || 'Member'

  // Admin UI: show Admin + max rank UI only for admin accounts
  // Admin source of truth comes from user doc fields we now store.
  const isAdmin = userData?.isAdmin === true || userData?.role === 'admin'
  const displayRankIndex = isAdmin ? 5 : rankIndex
  const displayRankName = isAdmin ? 'Admin' : rankName



  // Earned points estimate for this purchase (not persisted here)
  const pointsPer100 = getPointsPer100ByRankIndex(displayRankIndex)
  const earnedPointsNow = Math.floor(totalSpent / 100) * pointsPer100

  const nextRankIndex = Math.min(displayRankIndex + 1, 5)
  const nextThreshold = FADE_RANKS[nextRankIndex]?.threshold ?? 5000
  const prevThreshold = FADE_RANKS[rankIndex]?.threshold ?? 0

  // For admins: force full bar (100%) at MAX
  const progressToNext = isAdmin
    ? 100
    : (nextThreshold === prevThreshold
      ? 100
      : Math.max(0, Math.min(100, ((totalSpent - prevThreshold) / (nextThreshold - prevThreshold)) * 100)))

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

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* RANK CARD */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">


            <h2 className="text-lg font-bold mb-6">Fade Rank</h2>

            <div className="text-center">

              <div
                className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r ${rankColors[displayRankIndex] || rankColors[5]} flex items-center justify-center text-2xl font-black text-black shadow-lg`}
              >
                {displayRankName[0]}
              </div>

              <h3 className="mt-4 text-2xl font-black">{displayRankName}</h3>

              <p className="text-sm text-gray-400 mt-1">
                {displayRankIndex === 5 ? 'Max rank reached' : `${pointsPer100} Fade Points per ₹100`}
              </p>

            </div>

            <div className="mt-8">

              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{displayRankName}</span>
                <span>
                  {nextRankIndex === 5 ? 'MAX RANK' : rankNames[nextRankIndex]}
                </span>
              </div>

              <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${rankColors[displayRankIndex] || rankColors[5]}`}
                  style={{ width: `${Math.round(progressToNext)}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Progress: {Math.round(progressToNext)}%
              </p>

            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">

              <p className="text-xs text-gray-400 mb-1">Fade Points Earned</p>

              <h3 className="text-3xl font-black text-blue-400">+{earnedPointsNow}</h3>

            </div>

          </div>


          {/* DETAILS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl md:col-span-2">



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
        </div>
        {/* BOTTOM ACTIONS */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">


          <button
            onClick={downloadInvoice}
            className="py-4 rounded-xl cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold flex items-center justify-center gap-2"

          >
            <Download size={16} />
            Download Invoice
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="py-4 w-full cursor-pointer border border-white/20 rounded-xl"

          >
            View Profile
          </button>

          <button
            onClick={() => router.push('/store')}
            className="py-4 w-full cursor-pointer border border-white/20 rounded-xl"

          >
            Continue Shopping
          </button>

          <div onClick={() => router.push('/contact')}
            className="mt-6 p-4 border cursor-pointer border-yellow-500/20 rounded-xl text-center text-sm text-gray-300 md:col-span-3">
            <Mail className="mx-auto mb-2 text-yellow-400" size={20} />
            Need help? Contact support if your rank is missing.
          </div>


        </div>

      </div>
    </section>
  )
}

