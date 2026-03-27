"use client"
import { Crown, Medal } from "lucide-react"

export default function TopBuyers() {

  const users = [
    { id: 1, name: "ShadowX", total: 420, orders: 32 },
    { id: 2, name: "Nova", total: 390, orders: 28 },
    { id: 3, name: "RektGod", total: 310, orders: 21 },
  ]

  return (
    <section className="max-w-[900px] mx-auto px-6 pb-20">

      {/* HEADER */}
      <div className="text-center mb-12">
        <div
          className="text-[0.7rem] tracking-[0.2em] uppercase text-cyan-400 mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Leaderboard
        </div>

        <h2
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "1.8rem",
            fontWeight: 700,
            letterSpacing: "0.04em"
          }}
        >
          Top Supporters This Month
        </h2>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">

        {users.map((u, i) => (
          <div
            key={u.id}
            className="flex items-center gap-5 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:border-cyan-400/30"
          >

            {/* RANK ICON */}
            <div className="min-w-[30px] flex justify-center">
              {i === 0 && <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(246,201,14,0.6)]" size={22} />}
              {i === 1 && <Medal className="text-gray-300" size={20} />}
              {i === 2 && <Medal className="text-orange-400" size={20} />}
            </div>

            {/* AVATAR */}
            <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {u.name.charAt(0)}
            </div>

            {/* USER INFO */}
            <div>
              <div
                className="text-white"
                style={{
                  fontFamily: "Orbitron, monospace",
                  fontSize: "0.9rem",
                  fontWeight: 700
                }}
              >
                {u.name}
              </div>

              <div className="text-xs text-gray-400">
                {u.orders} orders
              </div>
            </div>

            {/* AMOUNT */}
            <div className="ml-auto text-right">
              <div
                className="text-yellow-400"
                style={{
                  fontFamily: "Orbitron, monospace",
                  fontSize: "1rem",
                  fontWeight: 700
                }}
              >
                ${u.total}
              </div>

              <div className="text-xs text-gray-500">
                total spent
              </div>
            </div>

          </div>
        ))}

      </div>

      {/* BUTTON (IMPORTANT FIX) */}
      <div className="text-center mt-8">
        <button className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-400 uppercase tracking-[0.06em] font-bold hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition">
          View All & Partners →
        </button>
      </div>

    </section>
  )
}