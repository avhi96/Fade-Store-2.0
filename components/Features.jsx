"use client"
import {
  Zap,
  ShieldCheck,
  Gift,
  MessageCircle,
  RefreshCcw,
  Trophy
} from "lucide-react"

export default function Features() {
  const data = [
    {
      icon: Zap,
      title: "Instant Delivery",
      desc: "All purchases are applied instantly. No waiting.",
      color: "rgba(99,179,237,0.12)"
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "Stripe, PayPal & crypto supported.",
      color: "rgba(159,122,234,0.12)"
    },
    {
      icon: Gift,
      title: "Exclusive Perks",
      desc: "Unique cosmetics & private features.",
      color: "rgba(246,201,14,0.12)"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      desc: "Discord support within minutes.",
      color: "rgba(104,211,145,0.12)"
    },
    {
      icon: RefreshCcw,
      title: "Rank Upgrades",
      desc: "Pay only the difference.",
      color: "rgba(237,100,166,0.12)"
    },
    {
      icon: Trophy,
      title: "Loyalty Rewards",
      desc: "Earn points on every purchase.",
      color: "rgba(79,209,197,0.12)"
    },
  ]

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-20">

      {/* HEADER */}
      <div className="text-center mb-16">
        <div
          className="text-[0.7rem] tracking-[0.2em] uppercase text-cyan-400 mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Why Choose Us
        </div>

        <h2
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.6rem,3vw,2.6rem)",
            fontWeight: 700,
            letterSpacing: "0.02em"
          }}
        >
          Everything You Need
        </h2>

        <div className="w-[60px] h-[2px] mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"/>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {data.map((f, i) => {
          const Icon = f.icon

          return (
            <div
              key={i}
              className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-[4px] hover:border-cyan-400/30 group overflow-hidden"
            >

              {/* TOP GLOW LINE */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition"/>

              {/* ICON */}
              <div
                className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-5"
                style={{ background: f.color }}
              >
                <Icon size={22} className="text-white" />
              </div>

              {/* TITLE */}
              <h3
                className="mb-2 text-white"
                style={{
                  fontFamily: "Orbitron, monospace",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em"
                }}
              >
                {f.title}
              </h3>

              {/* DESC */}
              <p
                className="text-gray-400"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: "1.65"
                }}
              >
                {f.desc}
              </p>
            </div>
          )
        })}

      </div>
    </section>
  )
}