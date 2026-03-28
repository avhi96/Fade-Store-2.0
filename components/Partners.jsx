"use client"

import { motion } from "framer-motion"

export default function Partners() {

  const partners = [
    { name: "Fade Hosting", tag: "Hosting" },
    { name: "Pixel Studios", tag: "Design" },
    { name: "CryptoPay", tag: "Payments" },
    { name: "Nova Nodes", tag: "Infrastructure" },
    { name: "SkyNet", tag: "Network" },
  ]

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

        {partners.map((p, i) => (
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

            {/* avatar */}
            <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl mb-4 shadow-[0_0_20px_rgba(99,179,237,0.3)] group-hover:shadow-[0_0_30px_rgba(99,179,237,0.6)] transition">
              {p.name.charAt(0)}
            </div>

            {/* name */}
            <div
              className="text-white text-sm mb-1"
              style={{
                fontFamily: "Orbitron, monospace",
                fontWeight: 700,
                letterSpacing: "0.06em"
              }}
            >
              {p.name}
            </div>

            {/* tag */}
            <div className="text-gray-400 text-xs mb-4">
              {p.tag}
            </div>

            {/* code box */}
            <div className="bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2 text-blue-400 text-xs tracking-[0.15em] font-mono group-hover:border-blue-400/40 transition">
              USE CODE {p.name.split(" ")[0].toUpperCase()}
            </div>

          </motion.div>
        ))}

      </div>

      {/* 🔷 TOP BUYERS */}
      <div>

        <div className="text-[0.7rem] tracking-[0.2em] uppercase text-blue-400 mb-6">
          Top Buyers — All Time
        </div>

        <div className="flex flex-col gap-3">

          {[1, 2, 3].map((rank, i) => (
            <motion.div
              key={rank}
              custom={i}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:border-blue-400/40"
            >

              {/* rank */}
              <div
                className="w-[40px] text-center font-bold"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                #{rank}
              </div>

              {/* avatar */}
              <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                U
              </div>

              {/* info */}
              <div>
                <div className="text-white text-sm font-semibold">
                  Player{rank}
                </div>
                <div className="text-gray-400 text-xs">
                  Top Supporter
                </div>
              </div>

              {/* amount */}
              <div className="ml-auto text-right">
                <div
                  className="text-yellow-400 text-sm font-bold"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  ${rank * 120}
                </div>
                <div className="text-gray-400 text-xs">
                  {rank * 5} orders
                </div>
              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  )
}