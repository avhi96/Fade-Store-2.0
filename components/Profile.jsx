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

export default function Profile() {

  const { data: session, status } = useSession()

  // ⏳ loading state
  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading...
      </div>
    )
  }

  // ❌ not logged in
  if (!session) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please login with Discord to view your profile.
      </div>
    )
  }

  // ✅ real user data
  const user = {
    name: session.user.name,
    avatar: session.user.image,
    tag: session.user.name,
    rank: "Premium"
  }

  // 🔥 demo purchases (later from DB)
  const purchases = [
    { name: "VIP Rank", price: 249, date: "March 2026" },
    { name: "Epic Key", price: 99, date: "Feb 2026" },
    { name: "Money Pack", price: 499, date: "Jan 2026" },
  ]

  // 🔥 POINTS SYSTEM (replace later with DB)
  const points = 420

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

      {/* 🔷 LAYOUT */}
      <div className="grid md:grid-cols-[300px_1fr] gap-8">

        {/* 🧊 LEFT PANEL */}
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
          <div className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.12em] bg-gradient-to-r from-yellow-400 to-orange-500 text-black mb-6">
            {user.rank}
          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <MiniStat label="Spent" value="₹1280" />
            <MiniStat label="Orders" value="12" />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3">

            <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-gray-300 hover:border-blue-400/40 hover:text-blue-400 transition">
              <Settings size={16} />
              Settings
            </button>

            <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-gray-300 hover:border-blue-400/40 hover:text-blue-400 transition">
              <CreditCard size={16} />
              Billing
            </button>

            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-400/20 text-red-400 hover:bg-red-400/10 transition"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </div>

        {/* 🧊 RIGHT PANEL */}
        <div className="flex flex-col gap-6">

          {/* 🔥 POINTS SYSTEM */}
          <div className="p-5 rounded-xl border border-blue-400/20 bg-blue-400/5 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-[0.7rem] uppercase tracking-[0.15em] text-blue-400 mb-1">
                  Nexus Points
                </div>

                <div
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  {points}
                </div>
              </div>

              <button className="px-4 py-2 text-xs rounded-lg border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 transition uppercase tracking-[0.1em]">
                Redeem
              </button>

            </div>

          </div>

          {/* 🔥 STATS */}
          <div className="grid sm:grid-cols-3 gap-5">
            <StatCard icon={DollarSign} label="Total Spent" value="₹1280" />
            <StatCard icon={ShoppingCart} label="Orders" value="12" />
            <StatCard icon={User} label="Account Type" value={user.rank} />
          </div>

          {/* 🔥 PURCHASE HISTORY */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-white"
                style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
              >
                Purchase History
              </h3>

              <button className="text-xs text-blue-400 uppercase tracking-[0.1em] hover:underline">
                View All
              </button>
            </div>

            <div className="flex flex-col gap-4">

              {purchases.map((p, i) => (
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
                    ₹{p.price}
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

/* 🔧 COMPONENTS */

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