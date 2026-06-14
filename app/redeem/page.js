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
        }),
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
    <main className="max-w-2xl mx-auto px-6 py-16">
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

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8">

        <label className="text-sm uppercase tracking-wider text-gray-400">
          Redeem Code
        </label>

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
            bg-white/5
            border
            border-white/10
            text-white
            placeholder-gray-500
            outline-none
            focus:border-cyan-400/50
            uppercase
            tracking-wider
          "
        />

        <button
          onClick={handleRedeem}
          disabled={!code.trim() || loading}
          className="
            mt-6
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            hover:scale-[1.01]
            transition-all
            text-white
            font-black
            tracking-wider
            disabled:opacity-50
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
    </main>
  )
}