"use client"
import { User, ShoppingCart, DollarSign, LogOut } from "lucide-react"

export default function Profile() {

  // 🔥 DEMO DATA (later Firebase)
  const user = {
    name: "Avhi",
    tag: "avhi#1234",
    avatar: "A",
    spent: 1280,
    orders: 12,
  }

  const purchases = [
    { name: "VIP Rank", price: 249, date: "March 2026" },
    { name: "Epic Key", price: 99, date: "Feb 2026" },
    { name: "Money Pack", price: 499, date: "Jan 2026" },
  ]

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20">

      {/* 🔥 HEADER */}
      <div className="text-center mb-16">

        <div
          className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Profile
        </div>

        <h1
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(2rem,4vw,3rem)",
            fontWeight: 900
          }}
          className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
        >
          Your Account
        </h1>

        <div className="w-[60px] h-[2px] mx-auto mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />

      </div>

      {/* 🔥 USER CARD */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-5 mb-10">

        {/* AVATAR */}
        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
          {user.avatar}
        </div>

        {/* INFO */}
        <div>
          <div
            className="text-white"
            style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
          >
            {user.name}
          </div>
          <div className="text-gray-400 text-sm">{user.tag}</div>
        </div>

        {/* LOGOUT */}
        <button className="ml-auto flex items-center gap-2 text-red-400 text-sm hover:text-red-300 transition">
          <LogOut size={16} />
          Logout
        </button>

      </div>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <StatCard icon={DollarSign} label="Total Spent" value={`₹${user.spent}`} />
        <StatCard icon={ShoppingCart} label="Orders" value={user.orders} />
        <StatCard icon={User} label="Account Type" value="Premium" />

      </div>

      {/* 🔥 PURCHASE HISTORY */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

        <h3
          className="mb-6 text-white"
          style={{
            fontFamily: "Orbitron, monospace",
            fontWeight: 700
          }}
        >
          Recent Purchases
        </h3>

        <div className="flex flex-col gap-4">

          {purchases.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-white/5 pb-3"
            >
              <div>
                <div className="text-white">{p.name}</div>
                <div className="text-gray-500 text-xs">{p.date}</div>
              </div>

              <div className="text-blue-400 font-bold">
                ₹{p.price}
              </div>
            </div>
          ))}

        </div>

      </div>

    </section>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-4">

      <div className="w-[40px] h-[40px] rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
        <Icon size={18} className="text-white" />
      </div>

      <div>
        <div className="text-gray-400 text-xs">{label}</div>
        <div className="text-white font-bold">{value}</div>
      </div>

    </div>
  )
}