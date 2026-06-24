"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Gift,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react"

export default function RedeemPage() {

  const { data: session } = useSession()

  const [username, setUsername] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleRedeem = async () => {

    setLoading(true)
    setSuccess("")
    setError("")

    try {

      const res = await fetch('/api/redeem/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          userId: session?.user?.id,
          username: username.trim(),
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Redeem failed')
      }

      setSuccess(data.message || 'Code redeemed successfully!')
      setCode("")

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-10">

        <button
          onClick={() => window.history.back()}
          className="
          cursor-pointer
      flex
      items-center
      gap-2
      text-gray-400
      hover:text-white
      transition
      text-sm
      font-medium
    "
        >
          <ArrowLeft size={18} />
          Back to Store
        </button>

      </div>

      <div className="text-center mb-12">

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 mb-6">
          <Gift size={38} className="text-cyan-300" />
        </div>

        <h1
          className="text-4xl font-black text-white"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          REDEEM CODE
        </h1>

        <p className="text-gray-400 mt-4">
          Redeem rewards, ranks, perks and server items
        </p>

      </div>

      <div className="
rounded-3xl
border
border-cyan-500/20
bg-gradient-to-b
from-white/[0.05]
to-white/[0.02]
backdrop-blur-2xl
shadow-[0_0_50px_rgba(34,211,238,.08)]
p-8
">

        <label className="text-sm uppercase tracking-wider text-gray-400">
          Redeem Code
        </label>
        <div className="mb-6">

          <label className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Minecraft Username
          </label>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Steve"
            className="
        mt-3
        w-full
        px-5
        py-4
        rounded-2xl
        bg-black/30
        border
        border-white/10
        text-white
        placeholder-gray-600
        outline-none
        focus:border-cyan-400/50
        transition
        "
          />

        </div>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ENTER CODE"
          className="
mt-3
w-full
px-5
py-4
rounded-2xl
bg-black/30
border
border-white/10
text-white
placeholder-gray-600
outline-none
focus:border-cyan-400/50
transition
uppercase
tracking-[0.25em]
"
        />

        <button
          onClick={handleRedeem}
          disabled={
            !username.trim() ||
            !code.trim() ||
            loading
          }
          className="
mt-8
w-full
py-4
rounded-2xl
bg-gradient-to-r
from-cyan-500
via-blue-500
to-blue-700
font-bold
tracking-[0.25em]
text-white
shadow-[0_0_30px_rgba(34,211,238,.35)]
hover:scale-[1.02]
hover:shadow-[0_0_45px_rgba(34,211,238,.45)]
transition-all
disabled:opacity-40
disabled:cursor-not-allowed
"
        >
          {loading ? 'Redeeming...' : 'REDEEM'}
        </button>

        {success && (
          <div className="mt-5 flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-center gap-2 text-red-400 text-sm">
            <XCircle size={18} />
            {error}
          </div>
        )}

      </div>
      <div className="mb-8 rounded-2xl border mt-7 border-cyan-500/20 bg-cyan-500/5 p-5">

    <h3
        className="text-cyan-300 font-bold mb-3"
        style={{ fontFamily: "Orbitron, monospace" }}
    >
        REDEEM INSTRUCTIONS
    </h3>

    <ul className="space-y-2 text-sm text-gray-400">

        <li>• Enter your Minecraft username exactly as it appears in-game.</li>

        <li>• Enter your redeem code.</li>

        <li>• Rewards will be delivered automatically if you're online.</li>

        <li>• If you're offline, delivery will be queued until you join.</li>

    </ul>

</div>
    </main>
  )
}