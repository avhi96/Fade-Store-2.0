"use client"
import { LogIn } from "lucide-react"

export default function Login() {
  return (
    <section className="flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-[420px] p-8 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-center">

        {/* TITLE */}
        <div className="mb-8">

          <div
            className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Account
          </div>

          <h1
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: "0.03em"
            }}
            className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            Sign In
          </h1>

          <div className="w-[60px] h-[2px] mx-auto mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />

        </div>

        {/* DESC */}
        <p className="text-gray-400 text-sm mb-8">
          Login using Discord to access your purchases and account.
        </p>

        {/* DISCORD BUTTON */}
        <button className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#5865F2] text-white font-bold uppercase tracking-[0.08em] shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:-translate-y-[1px] hover:shadow-[0_4px_30px_rgba(88,101,242,0.6)] transition">
          
          <LogIn size={18} />
          Login with Discord

        </button>

        {/* FOOTER */}
        <div className="mt-8 text-xs text-gray-500">
          By continuing, you agree to our Terms & Privacy Policy.
        </div>

      </div>

    </section>
  )
}