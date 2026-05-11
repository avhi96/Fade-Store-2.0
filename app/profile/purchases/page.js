'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getUser } from '@/lib/client-users'
import { ADMIN_IDS } from '@/lib/admins'

import { ShoppingCart, DollarSign, User, ArrowLeft } from 'lucide-react'
import { getFadeRankIndex } from '@/lib/fadePoints'


export default function PurchasesPage() {
  const { data: session, status } = useSession()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (!session?.user?.id) return
        const data = await getUser(session.user.id)
        setUserData(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session])

  const purchases = useMemo(() => {
    const list = Array.isArray(userData?.purchases) ? userData.purchases : []
    return list
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price || 0),
        qty: Number(p.qty || 1),
        subtotal: Number(p.subtotal || (Number(p.price || 0) * Number(p.qty || 1))),
        timestamp: p.timestamp || null,
        paymentMethod: p.paymentMethod || p.method || null,
        orderId: p.orderId || p.orderID || null,
        paymentId: p.paymentId || null,
        mcName: p.mcName || null,
        buyerEmail: p.buyerEmail || null
      }))
      .sort((a, b) => {
        const ta = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0
        const tb = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0
        return tb - ta
      })
  }, [userData])

  const totalSpent = useMemo(() => {
    return purchases.reduce((sum, p) => {
      const subtotal = Number(p?.subtotal ?? (Number(p?.price || 0) * Number(p?.qty || 1)))
      return sum + (Number.isFinite(subtotal) ? subtotal : 0)
    }, 0)
  }, [purchases])

  const isAdmin = !!(session?.user?.id && ADMIN_IDS.includes(session.user.id))

  const fadeRankIndex = getFadeRankIndex(totalSpent) // 0..5
  const fadeRankNames = ['Member', 'Stateer', 'Silver', 'Gold', 'Platinum', 'Diamond']
  const fadeRankColors = {
    0: 'from-gray-600 to-gray-400',
    1: 'from-blue-500 to-cyan-500',
    2: 'from-gray-400 to-gray-200',
    3: 'from-amber-500 to-orange-500',
    4: 'from-indigo-500 to-blue-500',
    5: 'from-purple-500 to-pink-500'
  }

  const nextThresholds = [
    { from: 0, to: 999, next: 1000, progressSpan: 1000 },
    { from: 1000, to: 1999, next: 2000, progressSpan: 1000 },
    { from: 2000, to: 2999, next: 3000, progressSpan: 1000 },
    { from: 3000, to: 3999, next: 4000, progressSpan: 1000 },
    { from: 4000, to: 4999, next: 5000, progressSpan: 1000 },
    { from: 5000, to: Infinity, next: null, progressSpan: 1 }
  ]

  const currentTier = nextThresholds[fadeRankIndex] || nextThresholds[0]
  const progress = fadeRankIndex >= 5 ? 100 : Math.min(100, Math.max(0, ((totalSpent - currentTier.from) / currentTier.progressSpan) * 100))

  const rankObj = isAdmin
    ? { name: 'Admin', color: 'from-red-500 to-pink-500', progress: 100 }
    : {
        name: fadeRankNames[fadeRankIndex],
        color: fadeRankColors[fadeRankIndex] || 'from-gray-600 to-gray-400',
        progress
      }


  const [query, setQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [sortMode, setSortMode] = useState('newest')

  const filteredPurchases = useMemo(() => {
    const q = query.trim().toLowerCase()

    let list = purchases

    if (methodFilter !== 'all') {
      list = list.filter((p) => String(p.paymentMethod || '').toLowerCase() === methodFilter)
    }

    if (q) {
      list = list.filter((p) => String(p.name || '').toLowerCase().includes(q))
    }

    if (sortMode === 'oldest') {
      list = [...list].sort((a, b) => {
        const ta = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0
        const tb = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0
        return ta - tb
      })
    }

    return list
  }, [purchases, query, methodFilter, sortMode])

  const availableMethods = useMemo(() => {
    const set = new Set()
    for (const p of purchases) {
      if (p.paymentMethod) set.add(String(p.paymentMethod).toLowerCase())
    }
    return Array.from(set)
  }, [purchases])

  const points = userData?.points || 0
  const orderCount = purchases.length

  if (status === 'loading' || loading) {
    return (
      <section className="min-h-screen py-20 text-white">
        <div className="text-center text-gray-400">Loading purchases...</div>
      </section>
    )
  }

  if (!session) {
    return (
      <section className="min-h-screen py-20 text-white">
        <div className="text-center text-gray-400">Please login with Discord.</div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-14 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={18} />
          Back to Profile
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Orbitron' }}>All Purchases</h1>
        <p className="text-gray-400 text-sm mt-2">Full purchase history and totals</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="text-[0.7rem] uppercase tracking-[0.15em] text-blue-400 mb-2">Fade Points</div>
          <div className="text-2xl font-bold">{points.toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-3">
          <DollarSign size={18} className="text-blue-400" />
          <div>
            <div className="text-[0.7rem] uppercase tracking-[0.15em] text-gray-400">Total Spent</div>
            <div className="text-xl font-bold">₹{totalSpent.toFixed(2)}</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-3">
          <ShoppingCart size={18} className="text-blue-400" />
          <div>
            <div className="text-[0.7rem] uppercase tracking-[0.15em] text-gray-400">Orders</div>
            <div className="text-xl font-bold">{orderCount}</div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Purchase List</h2>
          <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.12em] bg-gradient-to-r ${rankObj.color} text-black`}>
            Rank: {rankObj.name}
          </div>

          <div className="mt-4">
            {rankObj.progress >= 100 ? (
              <div className="text-xs text-gray-300">Max rank reached</div>
            ) : (
              <div>
                <div className="text-[0.7rem] uppercase tracking-[0.12em] text-gray-400 mb-2">Progress</div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${rankObj.progress.toFixed(1)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {purchases.length === 0 ? (
          <div className="text-gray-400 text-sm">No purchases found.</div>
        ) : (
          <div className="space-y-3">
            {purchases.map((p, i) => (
              <div
                key={
                  // Always include index to guarantee uniqueness even if backend data repeats orderId/paymentId
                  `${p.orderId || p.paymentId || p.id || p.name || 'p'}-${p.subtotal}-${i}`
                }
                className="p-4 rounded-xl border border-white/10 hover:border-blue-400/30 transition flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-white font-medium">{p.name}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {p.timestamp?.toDate ? p.timestamp.toDate().toLocaleString('en-IN') : (p.timestamp ? String(p.timestamp) : 'Recent')}
                  </div>
                  <div className="text-gray-400 text-xs mt-2">Qty: {p.qty}</div>
                </div>

                <div className="text-right">
                  <div className="text-blue-400 font-bold">₹{p.subtotal.toFixed(2)}</div>
                  <div className="text-gray-500 text-xs mt-1">Item: ₹{p.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
