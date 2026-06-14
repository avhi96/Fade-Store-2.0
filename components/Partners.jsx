"use client"

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { getStoreSettings } from '@/lib/settings'
import { getTopBuyers } from '@/lib/top-buyers'

export default function Partners() {
  const [partners, setPartners] = useState([])
  const [topBuyers, setTopBuyers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const p = getStoreSettings()
      .then((settings) => {
        if (Array.isArray(settings?.partners) && settings.partners.length > 0) {
          setPartners(settings.partners)
        } else {
          setPartners([])
        }
      })
      .catch((err) => {
        console.error('Failed to load partners from settings', err)
        setPartners([])
      })

    const o = getTopBuyers({
      limit: 5,
      period: 'all',
    })
      .then((buyers) => {
        setTopBuyers(buyers)
      })
      .catch((err) => {
        console.error('Failed to load top buyers', err)
        setTopBuyers([])
      })

    Promise.all([p, o]).finally(() => setLoading(false))
  }, [])

  // animations
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5 }
    })
  }

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-24">

      {/* HEADER */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="text-center mb-20"
      >
        <div className="text-[0.7rem] tracking-[0.2em] uppercase text-blue-400 mb-3">
          Community
        </div>

        <h1
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 700
          }}
          className="text-white"
        >
          Partners & Top Buyers
        </h1>

        <div className="w-[60px] h-[2px] bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-4 rounded" />
      </motion.div>

      {/* MARQUEE (smooth + subtle)
      <div className="overflow-hidden border-y border-white/10 py-6 mb-20 bg-white/[0.02]">
        <div className="flex gap-[70px] whitespace-nowrap animate-marquee w-max">

          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-gray-400 uppercase tracking-[0.1em] hover:text-blue-400 transition"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              <div className="w-[40px] h-[40px] rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                {p.name.charAt(0)}
              </div>

              {p.name}
            </div>
          ))}

        </div>
      </div> */}

      {/* PARTNERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-24">
        {loading ? (
          <div className="col-span-full text-center text-gray-400">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No partners available. Add partners in Admin Settings.</div>
        ) : (
          partners.map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition"
            >

              {/* hover glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition" />

              {/* partner header */}
              <div className="mb-3">
                <div className="text-white text-base font-semibold" style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.06em' }}>
                  {p?.name || 'Unnamed Partner'}
                </div>
                <div className="text-gray-400 text-xs mt-1">{p?.tag || 'Tag not set'}</div>
              </div>

              {/* link button */}
              <div className="mt-4">
                {p?.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-lg bg-blue-500 text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-400 transition"
                  >
                    Visit Partner
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">No partner link set</span>
                )}
              </div>

            </motion.div>
          ))
        )}
      </div>

      {/* 🔷 TOP BUYERS */}
      <div>

        <div className="text-[0.7rem] tracking-[0.2em] uppercase text-blue-400 mb-6">
          Top Buyers — All Time
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-gray-400">Loading top buyers...</div>
          ) : topBuyers.length === 0 ? (
            <div className="text-gray-400">No buyers yet</div>
          ) : (
            topBuyers.map((buyer, i) => (
              <motion.div
                key={buyer.userId}
                custom={i}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:border-blue-400/40"
              >

                <div
                  className="w-[40px] text-center font-bold"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  #{i + 1}
                </div>

                <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                  {buyer.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div>
                  <div className="text-white text-sm font-semibold">{buyer.userName}</div>
                  <div className="text-gray-400 text-xs">{buyer.orders} orders</div>
                </div>

                <div className="ml-auto text-right">
                  <div
                    className="text-yellow-400 text-sm font-bold"
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    ₹{buyer.total.toFixed(2)}
                  </div>
                </div>

              </motion.div>
            ))
          )}
        </div>

      </div>

    </section>
  )
}
