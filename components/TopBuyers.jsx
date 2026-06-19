"use client"
import { useEffect, useState } from 'react'
import { Crown, Medal } from "lucide-react"
import Link from "next/link"
import { getTopBuyers } from '@/lib/top-buyers'

export default function TopBuyers() {
  const [topBuyers, setTopBuyers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopBuyers({
      limit: 3,
      period: 'all',
    })
      .then((buyers) => {
        setTopBuyers(buyers)
      })
      .catch((error) => {
        console.error('Top buyers load failed:', error)
        setTopBuyers([])
      })
      .finally(() => setLoading(false))
  }, [])

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
          Top Supporters
        </h2>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading top supporters...</div>
        ) : topBuyers.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No top supporters this month yet.</div>
        ) : (
          topBuyers.map((buyer, i) => (
            <div
              key={buyer.userId}
              className="flex items-center gap-5 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:border-cyan-400/30"
            >

              {/* RANK ICON */}
              <div className="min-w-[30px] flex justify-center">
                {i === 0 && <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(246,201,14,0.6)]" size={22} />}
                {i === 1 && <Medal className="text-gray-300" size={20} />}
                {i === 2 && <Medal className="text-orange-400" size={20} />}
              </div>

              {/* AVATAR */}
              <div className="w-[44px] h-[44px] rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                {buyer.userName?.charAt(0)?.toUpperCase() || "U"}
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
                  {buyer.userName}
                </div>

                <div className="text-xs text-gray-400">
                  {buyer.orders} orders
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
                  ₹{Number(buyer.total).toFixed(2)}
                </div>

                <div className="text-xs text-gray-500">
                  total spent
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* BUTTON (IMPORTANT FIX) */}
      <div className="text-center mt-8">
        <Link href="/partners">
          <button className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-400 uppercase tracking-[0.06em] font-bold hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition cursor-pointer">
            View All & Partners →
          </button>
        </Link>
      </div>

    </section>
  )
}
