"use client"
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import clsx from "clsx"
import StoreCard from "./StoreCard"

const tabs = [
  { id: "ranks", label: "Ranks" },
  { id: "keys", label: "Crate Keys" },
  { id: "money", label: "Money" },
  { id: "bundles", label: "Bundles" },
]

export default function Store() {
  const [active, setActive] = useState("ranks")
  const [productsData, setProductsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductsData(data)
      setLoading(false)
    }, (err) => {
      console.error('Firestore error:', err)
      setError('Failed to load products')
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <div className="text-center py-20 text-xl text-gray-400">Loading store...</div>
  if (error) return <div className="text-center py-20 text-xl text-red-400">{error}</div>

  const filtered =
    active === "all"
      ? productsData
      : productsData.filter((p) => p.cat === active)

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-20">

      {/* HEADER */}
      <div className="text-center mb-14">

        <div
          className="text-[0.7rem] tracking-[0.2em] uppercase text-cyan-400 mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Store
        </div>

        <h2
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.6rem,3vw,2.6rem)",
            fontWeight: 700,
            letterSpacing: "0.02em"
          }}
        >
          Choose Your Edge
        </h2>

        <div className="w-[60px] h-[2px] mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"/>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex gap-3 flex-wrap mb-10 justify-center">

        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={clsx(
              "px-5 py-2 rounded-full cursor-pointer text-[0.82rem] font-semibold uppercase tracking-[0.08em] border transition",
              active === t.id
                ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                : "border-white/10 text-gray-500 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10"
            )}
          >
            {t.label}
          </button>
        ))}

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {filtered.map((p) => (
          <StoreCard key={p.id} p={p} />
        ))}

      </div>

    </section>
  )
}