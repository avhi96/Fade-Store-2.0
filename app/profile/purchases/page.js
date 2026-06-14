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

  // Reset on navigation/session change to prevent stale blank state.
  useEffect(() => {
    setUserData(null)
    setLoading(true)
  }, [session?.user?.id])

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    let didCancel = false

    async function load() {
      try {
        const data = await getUser(session.user.id)
        if (!didCancel) setUserData(data)
      } finally {
        if (!didCancel) setLoading(false)
      }
    }

    load()

    return () => {
      didCancel = true
    }
  }, [session?.user?.id])

  const purchases = useMemo(() => {
    const list = Array.isArray(userData?.purchases) ? userData.purchases : []

    const normalizeTimestampMillis = (value) => {
      if (!value) return null

      // Firestore Timestamp
      if (typeof value === 'object' && typeof value.toMillis === 'function') {
        const ms = value.toMillis()
        return Number.isFinite(ms) ? ms : null
      }

      // ISO string or other date-like strings
      if (typeof value === 'string') {
        const ms = Date.parse(value)
        return Number.isFinite(ms) ? ms : null
      }

      // Number (already millis)
      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null
      }

      // Date instance
      if (value instanceof Date) {
        const ms = value.getTime()
        return Number.isFinite(ms) ? ms : null
      }

      return null
    }

    // Deterministic fallback (no Date.now): if a record is missing timestamps,
    // we still want a stable sort order so newest records don't jump.
    const getStableFallbackMillis = (p) => {
      const id = String(
        p?.id ?? p?.orderId ?? p?.orderID ?? p?.paymentId ?? p?.paymentID ?? p?.name ?? 'p'
      )

      // Deterministic hash -> pseudo-ms bucket.
      // Use a fixed base so ordering doesn't depend on render time.
      let h = 0
      for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0

      const FIXED_BASE = 1735689600000 // 2025-01-01T00:00:00Z
      return FIXED_BASE + (h % 10_000)
    }

    const normalizePurchaseTimestamp = (p) => {
      // Keep compatibility with existing records by checking multiple possible fields.
      const ts = normalizeTimestampMillis(p?.timestamp)
      const createdAt = normalizeTimestampMillis(p?.createdAt)
      const fallbackAt = normalizeTimestampMillis(p?.fallbackAt)
      const updatedAt = normalizeTimestampMillis(p?.updatedAt)

      const sortTs = ts ?? createdAt ?? fallbackAt ?? updatedAt ?? getStableFallbackMillis(p)

      // Prefer original timestamp for display when available; otherwise use the derived sortTs.
      const displayMs = ts ?? createdAt ?? fallbackAt ?? updatedAt ?? sortTs

      return {
        sortTs,
        displayMs
      }
    }


    return list
      .map((p) => {
        const { sortTs, displayMs } = normalizePurchaseTimestamp(p)
        const paymentKey = p?.paymentId || p?.paymentID || ''
        const orderKey = p?.orderId || p?.orderID || ''

        return {
          id: p.id,
          name:
            p.name ||
            p.title ||
            p.itemName ||
            p.productName ||
            (p.type === 'points_redemption'
              ? 'Fade Points Redemption'
              : 'Unknown Purchase'),
          price: Number(
            p.price ??
            p.cost ??
            p.amount ??
            0
          ),
          qty: Number(p.qty || 1),
          subtotal: Number(
            p.subtotal ??
            p.pointsUsed ??
            (
              Number(
                p.price ??
                p.cost ??
                p.amount ??
                0
              ) * Number(p.qty || 1)
            )
          ),
          pointsCost: Number(
            p.pointsCost ??
            p.pointsUsed ??
            p.fp ??
            0
          ),
          currency: p.currency || null,
          type: p.type || null,
          verified: !!p.verified,

          // Keep existing field for compatibility, but also provide normalized fields.
          timestamp: p.timestamp || null,
          createdAt: p.createdAt || null,
          fallbackAt: p.fallbackAt || null,
          updatedAt: p.updatedAt || null,

          sortTs,
          displayTimestamp: displayMs,

          paymentMethod: p.paymentMethod || p.method || null,
          paymentId: paymentKey || null,
          orderId: orderKey || null,
          mcName: p.mcName || null,
          buyerEmail: p.buyerEmail || null
        }
      })
      .sort((a, b) => {
        // Newest first.
        const dt = b.sortTs - a.sortTs
        if (dt !== 0) return dt

        // Stable tie-breakers so ordering doesn't flicker.
        const aPay = String(a.paymentId || '')
        const bPay = String(b.paymentId || '')
        if (aPay !== bPay) return aPay < bPay ? 1 : -1

        const aOrd = String(a.orderId || '')
        const bOrd = String(b.orderId || '')
        if (aOrd !== bOrd) return aOrd < bOrd ? 1 : -1

        const aId = String(a.id || '')
        const bId = String(b.id || '')
        return aId < bId ? 1 : -1
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
      // Oldest first uses the same normalized sortTs we computed above.
      // Keep it stable and null-safe.
      list = [...list].sort((a, b) => {
        const dt = a.sortTs - b.sortTs
        if (dt !== 0) return dt

        const aPay = String(a.paymentId || '')
        const bPay = String(b.paymentId || '')
        if (aPay !== bPay) return aPay < bPay ? -1 : 1

        const aOrd = String(a.orderId || '')
        const bOrd = String(b.orderId || '')
        if (aOrd !== bOrd) return aOrd < bOrd ? -1 : 1

        const aId = String(a.id || '')
        const bId = String(b.id || '')
        return aId < bId ? -1 : 1
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

        {filteredPurchases.length === 0 ? (
          <div className="text-gray-400 text-sm">No purchases found.</div>
        ) : (
          <div className="space-y-3">
            {filteredPurchases.map((p, i) => (

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
                    {typeof p.displayTimestamp === 'number' && Number.isFinite(p.displayTimestamp) ? (
                      new Date(p.displayTimestamp).toLocaleString('en-IN')
                    ) : (
                      'Recent'
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-2">Qty: {p.qty}</div>
                </div>

                <div className="text-right">
                  {p.currency === 'FP' || p.type === 'points_redemption' ? (
                    <>
                      <div className="text-blue-400 font-bold">{Number(p.pointsCost ?? p.subtotal ?? 0).toFixed(0)} FP</div>
                      <div className="text-gray-500 text-xs mt-1">Item: {Number(p.pointsCost ?? p.subtotal ?? 0).toFixed(0)} FP</div>
                    </>
                  ) : (
                    <>
                      <div className="text-blue-400 font-bold">
                        ₹{Number(p.subtotal || 0).toFixed(2)}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Item: ₹{Number(p.price || 0).toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
