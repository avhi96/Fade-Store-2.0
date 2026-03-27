"use client"
import {
  KeyRound,
  Crown,
  Wallet,
  Zap,
  Gift,
  Shield
} from "lucide-react"

export default function Marquee() {
  const items = [
    { icon: KeyRound, text: "Crate Keys", highlight: "AVAILABLE" },
    { icon: Crown, text: "Sage Ranks", highlight: "FROM ₹249" },
    { icon: Wallet, text: "In-Game Money", highlight: "INSTANT" },
    { icon: Zap, text: "Flash Sale", highlight: "30% OFF" },
    { icon: Gift, text: "Season 2 Crate", highlight: "NEW" },
    { icon: Shield, text: "Assassin+ Rank", highlight: "POPULAR" },
  ]

  return (
    <div className="overflow-hidden mt-10 border-y border-white/10 py-3 bg-cyan-400/[0.03]">

      <div className="flex gap-[60px] whitespace-nowrap animate-marquee w-max">

        {[...items, ...items].map((item, i) => {
          const Icon = item.icon

          return (
            <div
              key={i}
              className="flex items-center gap-2 uppercase tracking-[0.12em] text-gray-400 text-[0.78rem]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {/* ICON */}
              <Icon size={14} className="text-cyan-400 opacity-80" />

              {/* TEXT */}
              {item.text}

              {/* HIGHLIGHT */}
              <span className="text-cyan-400">
                {item.highlight}
              </span>
            </div>
          )
        })}

      </div>

    </div>
  )
}