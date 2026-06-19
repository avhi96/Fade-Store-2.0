"use client"

import {
  User,
  ShoppingCart,
  DollarSign,
  LogOut,
  Settings,
  CreditCard
} from "lucide-react"


import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { getUser } from "@/lib/client-users"
import { ADMIN_IDS } from "@/lib/admins"
import { FADE_RANKS, getFadeRankIndex } from "@/lib/fadePoints"
import Link from "next/link"

export default function Profile() {
  const router = useRouter()

  const { data: session, status } = useSession()

  // loading state
  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading...
      </div>
    )
  }

  // not logged in
  if (!session) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please login with Discord to view your profile.
      </div>
    )
  }

  const [userData, setUserData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (session?.user?.id) {
        const data = await getUser(session.user.id)
        setUserData(data)
      }
      setLoadingData(false)
    }
    loadUser()
  }, [session])

  if (loadingData) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading your data...
      </div>
    )
  }

  const isAdmin = ADMIN_IDS.includes(session.user.id)

  const totalSpent = userData
    ? (() => {
      // IMPORTANT: derive from verified purchases (checkout currently writes totalSpent per cart-item loop).
      const purchasesArr = Array.isArray(userData.purchases) ? userData.purchases : []
      return purchasesArr.reduce((sum, p) => {
        if (!p?.verified) return sum
        const sub = Number(p?.subtotal ?? (Number(p?.price || 0) * Number(p?.qty || 1)))
        return sum + (Number.isFinite(sub) ? sub : 0)
      }, 0)
    })()
    : 0

  const fadeRankIndex = getFadeRankIndex(totalSpent) // 0..5
  const fadeRankName = FADE_RANKS[fadeRankIndex]?.key ?? 'Member'
  const fadeRankThreshold = FADE_RANKS[fadeRankIndex]?.threshold ?? 0
  const nextFadeRank = FADE_RANKS[Math.min(fadeRankIndex + 1, FADE_RANKS.length - 1)]
  const nextThreshold = nextFadeRank?.threshold ?? fadeRankThreshold
  const prevThreshold = fadeRankThreshold

  const progressToNext =
    fadeRankIndex >= FADE_RANKS.length - 1
      ? 100
      : nextThreshold === prevThreshold
        ? 100
        : Math.max(0, Math.min(100, ((totalSpent - prevThreshold) / (nextThreshold - prevThreshold)) * 100))

  const rankColors = {
    0: 'from-gray-600 to-gray-400',
    1: 'from-blue-500 to-cyan-500',
    2: 'from-gray-400 to-gray-200',
    3: 'from-amber-500 to-orange-500',
    4: 'from-indigo-500 to-blue-500',
    5: 'from-purple-500 to-pink-500',
  }

  const rankObj = isAdmin
    ? { name: 'Admin', color: 'from-red-500 to-pink-500', index: null }
    : { name: fadeRankName, color: rankColors[fadeRankIndex], index: fadeRankIndex }

  const user = {
    name: session.user.name,
    avatar: session.user.image,
    tag: session.user.name,
    rank: rankObj.name
  }

  const purchases = (userData?.purchases || [])
    .map((p) => {
      const normalizeTimestampMillis = (value) => {
        if (!value) return null
        // Firestore Timestamp
        if (typeof value === 'object' && typeof value.toMillis === 'function') {
          const ms = value.toMillis()
          return Number.isFinite(ms) ? ms : null
        }
        // ISO string
        if (typeof value === 'string') {
          const ms = Date.parse(value)
          return Number.isFinite(ms) ? ms : null
        }
        // number
        if (typeof value === 'number') {
          return Number.isFinite(value) ? value : null
        }
        // Date
        if (value instanceof Date) {
          const ms = value.getTime()
          return Number.isFinite(ms) ? ms : null
        }
        return null
      }

      const ts = normalizeTimestampMillis(p?.timestamp)
      const createdAt = normalizeTimestampMillis(p?.createdAt)
      const fallbackAt = normalizeTimestampMillis(p?.fallbackAt)
      const updatedAt = normalizeTimestampMillis(p?.updatedAt)

      // stable deterministic fallback (no Date.now): if timestamps are missing,
      // we still keep ordering consistent.
      let h = 0
      const id = String(
        p?.id ?? p?.orderId ?? p?.orderID ?? p?.paymentId ?? p?.paymentID ?? p?.name ?? 'p'
      )
      for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0

      const FIXED_BASE = 1735689600000 // 2025-01-01T00:00:00Z
      const stableFallback = FIXED_BASE + (h % 10_000)

      const sortTs = ts ?? createdAt ?? fallbackAt ?? updatedAt ?? stableFallback

      return {
        name: p.name,
        price: p.price,
        pointsCost: p.pointsCost,
        currency: p.currency,
        type: p.type,
        sortTs,
        date: ts
          ? new Date(ts).toLocaleDateString()
          : createdAt
            ? new Date(createdAt).toLocaleDateString()
            : 'Recent',
      }
    })
    .sort((a, b) => b.sortTs - a.sortTs)
    .slice(0, 5)

  const points = userData?.points || 0

  const orderCount = userData?.purchases?.length || 0

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-24">

      {/* 🔷 HEADER */}
      <div className="text-center mb-16">
        <div className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-3">
          Account
        </div>

        <h1
          className="text-white"
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 700
          }}
        >
          Your Profile
        </h1>

        <div className="w-[60px] h-[2px] mx-auto mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />
      </div>

      {/* LAYOUT */}
      <div className="grid md:grid-cols-[300px_1fr] gap-8">

        {/* LEFT PANEL */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-center">

          {/* AVATAR */}
          <div className="relative w-[90px] h-[90px] mx-auto mb-4 rounded-full overflow-hidden border border-white/10 shadow-[0_0_25px_rgba(99,179,237,0.4)]">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />

            <span className="absolute bottom-1 right-1 w-[14px] h-[14px] bg-green-400 rounded-full border-2 border-[#030610]" />
          </div>

          {/* NAME */}
          <div
            className="text-white mb-1"
            style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
          >
            {user.name}
          </div>

          <div className="text-gray-400 text-sm mb-4">{user.tag}</div>

          {/* RANK */}
          <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.12em] bg-gradient-to-r ${rankObj.color} text-black mb-4 shadow-lg`}>
            {user.rank}
          </div>

          {/* RANK PROGRESS BAR (fade ranks only) */}
          {!isAdmin && (
            <div className="mb-6">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Progress to {fadeRankIndex >= FADE_RANKS.length - 1 ? 'MAX RANK' : `next ${nextFadeRank?.key ?? ''}`}
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2 border border-white/5 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all bg-gradient-to-r ${rankObj.color}`}
                  style={{ width: `${progressToNext}%` }}
                />
              </div>

              <div className="text-xs text-gray-400 mt-1 text-right">
                {fadeRankIndex >= FADE_RANKS.length - 1 ? 'Done' : `₹${Math.max(0, nextThreshold - totalSpent).toFixed(0)} to next`}
              </div>
            </div>
          )}

          {/* MINI STATS */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <MiniStat label="Spent" value={`₹${totalSpent.toFixed(0)}`} />
            <MiniStat label="Orders" value={orderCount.toString()} />
          </div>

          {/* ACTIONS (Logout only) */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-400/20 text-red-400 hover:bg-red-400/10 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-6">

          {/* POINTS SYSTEM */}
          <div className="p-5 rounded-xl border border-blue-400/20 bg-blue-400/5 backdrop-blur-xl">

            <div className="flex items-center justify-between gap-4">

              <div>
                <div className="text-[0.7rem] uppercase tracking-[0.15em] text-blue-400 mb-1">
                  Fade Points
                </div>

                <div
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  {points.toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => {
                  router.push('/store?category=money')
                }}
                className="px-4 py-2 text-xs rounded-lg border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 transition uppercase tracking-[0.1em]"
              >
                Redeem
              </button>

            </div>

          </div>

          {/* STATS */}
          <div className="grid sm:grid-cols-3 gap-5">
            <StatCard icon={DollarSign} label="Total Spent" value={`₹${totalSpent.toFixed(0)}`} />
            <StatCard icon={ShoppingCart} label="Orders" value={orderCount.toString()} />
            <StatCard icon={User} label="Account Type" value={isAdmin ? "Admin" : "Player"} />
          </div>

          {/* PURCHASE HISTORY */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-white"
                style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
              >
                Purchase History
              </h3>

              <a
                href="/profile/purchases"
                className="text-xs text-blue-400 uppercase tracking-[0.1em] hover:underline"
              >
                View All
              </a>
            </div>

            <div className="flex flex-col gap-4">

              {purchases

                .slice(0, 2)
                .map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-3 border-b border-white/5 hover:border-blue-400/30 transition"
                  >
                    <div>
                      <div className="text-white text-sm">{p.name}</div>
                      <div className="text-gray-500 text-xs">{p.date}</div>
                    </div>

                    <div
                      className="text-yellow-400 text-sm font-bold"
                      style={{ fontFamily: "Orbitron, monospace" }}
                    >
                      {(p.type === 'points_redemption' || p.currency === 'FP')
                        ? `${Number(p.pointsCost ?? p.price ?? 0).toFixed(0)} FP`
                        : `₹${p.price}`}
                    </div>
                  </div>
                ))}

            </div>

          </div>

          {/* LEGAL LINKS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

            <Link
              href="/legal/privacy"
              className="py-3 rounded-xl border border-white/10 bg-white/[0.03] text-center text-sm text-gray-300 hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-400 transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="/legal/refund"
              className="py-3 rounded-xl border border-white/10 bg-white/[0.03] text-center text-sm text-gray-300 hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-400 transition"
            >
              Refund Policy
            </Link>

            <Link
              href="/legal/terms"
              className="py-3 rounded-xl border border-white/10 bg-white/[0.03] text-center text-sm text-gray-300 hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-400 transition"
            >
              Terms of Service
            </Link>

          </div>
        </div>

      </div>

    </section>
  )

}

/* COMPONENTS */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-4 hover:border-blue-400/40 transition">

      <div className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,179,237,0.4)]">
        <Icon size={18} className="text-white" />
      </div>

      <div>
        <div className="text-gray-400 text-xs uppercase tracking-[0.08em]">{label}</div>
        <div className="text-white font-bold">{value}</div>
      </div>

    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03] text-center">
      <div className="text-white text-sm font-bold">{value}</div>
      <div className="text-gray-400 text-[0.7rem] uppercase tracking-[0.1em]">
        {label}
      </div>
    </div>
  )
}
