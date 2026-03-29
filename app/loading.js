"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030610] relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full animate-pulse" />

      {/* 🔷 CENTER CONTENT */}
      <div className="flex flex-col items-center gap-6">

        {/* 🔵 ANIMATED ORB */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-[0_0_40px_rgba(99,179,237,0.7)]"
        />

        {/* 🔤 TEXT */}
        <motion.h1
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontFamily: "Orbitron, monospace",
            letterSpacing: "0.2em"
          }}
          className="text-white text-sm uppercase"
        >
          Loading
        </motion.h1>

        {/* 🔽 SUBTEXT */}
        <p className="text-gray-500 text-xs tracking-[0.15em] uppercase">
          Initializing Store...
        </p>

      </div>

    </div>
  )
}