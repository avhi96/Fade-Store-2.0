import Link from "next/link"

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-6 pt-[110px] relative">

      {/* BADGE */}
      <div
        className="flex items-center gap-2 px-4 py-[6px] rounded-full border border-blue-400/30 bg-blue-400/10 text-[0.75rem] tracking-[0.12em] uppercase text-blue-400 mb-8"
        style={{
          fontFamily: "Inter, sans-serif",
          animation: "fadeDown 0.8s ease both"
        }}
      >
        <span className="w-[6px] h-[6px] bg-green-400 rounded-full animate-pulse"></span>
        Server Online · Season Active
      </div>

      {/* TITLE */}
      <h1
        className="mb-6"
        style={{
          fontFamily: "Orbitron, monospace",
          fontWeight: 900,
          fontSize: "clamp(2.8rem, 7vw, 6rem)",
          lineHeight: 1.05,
          letterSpacing: "0.02em",
          animation: "fadeDown 0.8s 0.1s ease both"
        }}
      >
        <span className="block bg-gradient-to-r from-white via-white to-cyan-400 bg-clip-text text-transparent">
          ELEVATE YOUR
        </span>
        <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          GAME
        </span>
      </h1>

      {/* SUBTEXT */}
      <p
        className="max-w-[560px] text-[1.15rem] text-gray-400 leading-[1.7] mb-10"
        style={{
          fontFamily: "Rajdhani, sans-serif",
          animation: "fadeDown 0.8s 0.2s ease both"
        }}
      >
        Premium ranks, crate keys & in-game currency. Unlock exclusive perks, cosmetics and dominate the leaderboards on Fade Network.
      </p>

      {/* BUTTONS */}
      <div
        className="flex gap-4 flex-wrap justify-center"
        style={{ animation: "fadeDown 0.8s 0.3s ease both" }}
      >
        <Link href="/store">
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400/20 to-blue-500/50 text-white font-bold tracking-[0.06em] uppercase shadow-[0_0_20px_rgba(99,179,237,0.3)] hover:-translate-y-[1px] hover:shadow-[0_4px_30px_rgba(99,179,237,0.5)] transition hover:cursor-pointer">
          Browse Store →
        </button>
        </Link>
        <Link href="/updates">
        <button className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-400 uppercase tracking-[0.06em] font-bold hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition hover:cursor-pointer">
          Latest Updates
        </button>
        </Link>
      </div>

      {/* STATS */}
      <div
        className="flex gap-[60px] mt-20"
        style={{ animation: "fadeDown 0.8s 0.4s ease both" }}
      >
        {[
          { num: "12K+", label: "Players" },
          { num: "98K", label: "Orders" },
          { num: "4.9★", label: "Rating" },
          { num: "24/7", label: "Support" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#63b3ed",
                textShadow: "0 0 20px rgba(99,179,237,0.4)"
              }}
            >
              {s.num}
            </div>
            <div className="text-[0.78rem] text-gray-500 tracking-[0.1em] uppercase mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* SCROLL INDICATOR */}
      <div
        className="absolute bottom-1 flex flex-col items-center gap-2 text-gray-500 text-[0.7rem] uppercase tracking-[0.15em]"
        style={{ animation: "fadeDown 1s 1s ease both" }}
      >
        <div className="w-[1px] h-[40px] bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"></div>
        Scroll
      </div>

    </section>
  )
}