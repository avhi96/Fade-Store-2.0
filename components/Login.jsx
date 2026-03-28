"use client"

import { signIn } from "next-auth/react"
import { LogIn } from "lucide-react"

export default function Login() {
  return (
    <section className="flex items-center justify-center px-6 py-24 relative">

      {/* Glow background effect */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative w-full max-w-[440px] p-[1px] rounded-2xl bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-transparent">

        {/* Glass Card */}
        <div className="w-full p-8 rounded-2xl bg-gray-900/80 backdrop-2xl border border-white/10 text-center">

          {/* TOP BADGE */}
          <div className="mb-6">
            <div className="inline-block px-4 py-1 text-[0.65rem] tracking-[0.25em] uppercase text-blue-400 border border-blue-400/30 bg-blue-400/10 rounded-full">
              Account Access
            </div>
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "2.2rem",
              fontWeight: 900,
              letterSpacing: "0.04em"
            }}
            className="bg-gradient-to-r from-white via-blue-200 to-indigo-400 bg-clip-text text-transparent"
          >
            SIGN IN
          </h1>

          {/* GLOW LINE */}
          <div className="w-[70px] h-[2px] mx-auto mt-4 mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded shadow-[0_0_10px_rgba(99,179,237,0.7)]" />

          {/* DESC */}
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Connect your Discord account to access purchases, ranks, and exclusive perks.
          </p>

          {/* DISCORD BUTTON */}
          <button
          onClick={() => signIn("discord")}
          className="group w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#5865F2] text-white font-bold uppercase tracking-[0.08em] shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:-translate-y-[2px] cursor-pointer transition-all duration-200">

            <LogIn size={18} className="group-hover:scale-110 transition" />

            Login with Discord

          </button>

          {/* PERKS BOX */}
          <div className="mt-8 text-left p-4 rounded-xl border border-blue-400/20 bg-blue-400/5">

            <div className="text-[0.7rem] uppercase tracking-[0.15em] text-blue-400 mb-3">
              Benefits
            </div>

            <ul className="text-sm text-gray-400 space-y-2">
              <li>✓ Instant purchase syncing</li>
              <li>✓ Access your ranks & rewards</li>
              <li>✓ Exclusive store discounts</li>
              <li>✓ Faster checkout experience</li>
            </ul>

          </div>

          {/* FOOTER */}
          <div className="mt-8 text-xs text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy.
          </div>

        </div>
      </div>
    </section>
  )
}