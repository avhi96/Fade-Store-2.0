"use client"

export default function Partners() {

  const partners = [
    { name: "Fade Hosting", tag: "Hosting" },
    { name: "Pixel Studios", tag: "Design" },
    { name: "CryptoPay", tag: "Payments" },
    { name: "Nova Nodes", tag: "Infrastructure" },
    { name: "SkyNet", tag: "Network" },
  ]

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">

      {/* 🔥 HERO */}
      <div className="text-center mb-20">

        <div
          className="text-[0.7rem] tracking-[0.2em] uppercase text-blue-400 mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Partners
        </div>

        <h1
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(2rem,4vw,3.2rem)",
            fontWeight: 900,
            letterSpacing: "0.02em"
          }}
        >
          Powering the Network
        </h1>

        <p
          className="text-gray-400 mt-5 max-w-[600px] mx-auto"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          We collaborate with top-tier providers to deliver the best experience, performance, and security for our players.
        </p>
      </div>

      {/* 🔥 LOGO MARQUEE */}
      <div className="overflow-hidden border-y border-white/10 py-6 mb-20 bg-white/[0.02]">

        <div className="flex gap-[80px] whitespace-nowrap animate-marquee w-max">

          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-gray-400 uppercase tracking-[0.1em]"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              <div className="w-[40px] h-[40px] rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                {p.name.charAt(0)}
              </div>

              {p.name}
            </div>
          ))}

        </div>
      </div>

      {/* 🔥 FEATURED PARTNERS */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">

        {partners.slice(0, 3).map((p, i) => (
          <div
            key={i}
            className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-[5px] hover:border-blue-400/40"
          >

            {/* GLOW */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition" />

            {/* LOGO */}
            <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold mb-4">
              {p.name.charAt(0)}
            </div>

            {/* NAME */}
            <h3
              className="text-white mb-2"
              style={{
                fontFamily: "Orbitron, monospace",
                fontWeight: 700
              }}
            >
              {p.name}
            </h3>

            {/* DESC */}
            <p
              className="text-gray-400 text-sm mb-4"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              Premium partner providing high-quality services and infrastructure.
            </p>

            {/* TAG */}
            <span className="text-xs text-blue-400 uppercase tracking-[0.1em]">
              {p.tag}
            </span>

          </div>
        ))}

      </div>

      {/* 🔥 CTA */}
      <div className="text-center">

        <h3
          className="text-white mb-4"
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "1.4rem",
            fontWeight: 700
          }}
        >
          Become a Partner
        </h3>

        <p className="text-gray-400 mb-6">
          Join our network and grow together with Fade Store.
        </p>

        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold uppercase tracking-[0.06em] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-[1px] transition">
          Apply Now →
        </button>

      </div>

    </section>
  )
}