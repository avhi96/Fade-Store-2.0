"use client"

import {
  Users,
  ShoppingCart,
  DollarSign,
  Settings,
  Plus,
  BarChart3
} from "lucide-react"

export default function Admin() {

  // 🔥 DEMO DATA (replace later with DB)
  const stats = {
    revenue: 12800,
    orders: 124,
    users: 58,
    pointsIssued: 5420
  }

  const recentOrders = [
    { user: "Avhi", item: "VIP Rank", price: 249 },
    { user: "Rohan", item: "Epic Key", price: 99 },
    { user: "Aryan", item: "Money Pack", price: 499 },
  ]

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-24">

      {/* 🔷 HEADER */}
      <div className="mb-16">

        <div className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-3">
          Admin Panel
        </div>

        <h1
          className="text-white"
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 700
          }}
        >
          Dashboard Control
        </h1>

        <div className="w-[60px] h-[2px] mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />
      </div>

      {/* 🔥 STATS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-12">

        <Stat icon={DollarSign} label="Revenue" value={`₹${stats.revenue}`} />
        <Stat icon={ShoppingCart} label="Orders" value={stats.orders} />
        <Stat icon={Users} label="Users" value={stats.users} />
        <Stat icon={BarChart3} label="Points Issued" value={stats.pointsIssued} />

      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid md:grid-cols-[1fr_320px] gap-8">

        {/* 🧊 LEFT SIDE */}
        <div className="flex flex-col gap-6">

          {/* RECENT ORDERS */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <h3
              className="text-white mb-6"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              Recent Orders
            </h3>

            <div className="flex flex-col gap-4">

              {recentOrders.map((o, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-white/5 pb-3 hover:border-blue-400/30 transition"
                >
                  <div>
                    <div className="text-white text-sm">{o.item}</div>
                    <div className="text-gray-500 text-xs">{o.user}</div>
                  </div>

                  <div className="text-yellow-400 font-bold">
                    ₹{o.price}
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* POINTS CONTROL */}
          <div className="p-6 rounded-2xl border border-blue-400/20 bg-blue-400/5 backdrop-blur-xl">

            <h3
              className="text-white mb-4"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              Points System
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              Configure how many points users earn per purchase.
            </p>

            <div className="flex items-center gap-4">

              <input
                type="number"
                defaultValue={10}
                className="w-[80px] p-2 rounded-lg bg-white/[0.05] border border-white/10 text-white outline-none"
              />

              <span className="text-gray-400 text-sm">
                points per ₹100 spent
              </span>

            </div>

          </div>

        </div>

        {/* 🧊 RIGHT SIDE */}
        <div className="flex flex-col gap-6">

          {/* QUICK ACTIONS */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <h3
              className="text-white mb-6"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              Quick Actions
            </h3>

            <div className="flex flex-col gap-3">

              <ActionBtn icon={Plus} label="Add Product" />
              <ActionBtn icon={Users} label="Manage Users" />
              <ActionBtn icon={ShoppingCart} label="View Orders" />
              <ActionBtn icon={Settings} label="Store Settings" />

            </div>

          </div>

          {/* SYSTEM STATUS */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <h3
              className="text-white mb-4"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              System Status
            </h3>

            <div className="flex items-center gap-2 text-green-400 text-sm">
              ● All Systems Operational
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

/* 🔧 COMPONENTS */

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-4 hover:border-blue-400/40 transition">

      <div className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,179,237,0.4)]">
        <Icon size={18} className="text-white" />
      </div>

      <div>
        <div className="text-gray-400 text-xs uppercase tracking-[0.08em]">
          {label}
        </div>
        <div className="text-white font-bold">{value}</div>
      </div>

    </div>
  )
}

function ActionBtn({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.03] text-gray-300 hover:border-blue-400/40 hover:text-blue-400 transition">

      <Icon size={16} />
      {label}

    </button>
  )
}