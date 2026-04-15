"use client"
import { useState, useEffect } from 'react'
import { List } from 'lucide-react'
import { getStoreUpdates } from '@/lib/updates'

const filters = [
  { id: "all", label: "All" },
  { id: "announcement", label: "Announcements" },
  { id: "patch", label: "Patch Notes" },
  { id: "event", label: "Events" },
]

export default function Updates() {
  const [active, setActive] = useState("all")
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    getStoreUpdates().then(setUpdates)
  }, [])

  const filtered = active === "all" ? updates : updates.filter((u) => u.type === active)

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20">

      {/* HEADER */}
      <div className="text-center mb-12">
        <div
          className="text-[0.7rem] tracking-[0.2em] uppercase text-blue-400 mb-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Updates
        </div>

        <h2
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.6rem,3vw,2.6rem)",
            fontWeight: 700,
            letterSpacing: "0.02em"
          }}
        >
          Latest News & Changes
        </h2>

        <div className="w-[60px] h-[2px] mx-auto mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded"/>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 flex-wrap justify-center mb-12">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`
              px-5 py-2 rounded-full cursor-pointer text-[0.8rem] font-semibold uppercase tracking-[0.08em] border transition
              ${active === f.id
                ? "border-blue-400 text-blue-400 bg-blue-400/10"
                : "border-white/10 text-gray-500 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10"}
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-6">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-[4px] hover:border-blue-400/40"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="flex justify-between mb-3">
              <span className={`
                px-3 py-1 text-[0.65rem] uppercase font-bold tracking-[0.1em] rounded-full
                ${u.type === "announcement" && "bg-blue-400/20 text-blue-400 border border-blue-400/30"}
                ${u.type === "event" && "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"}
                ${u.type === "patch" && "bg-green-400/20 text-green-400 border border-green-400/30"}
              `}>
                {u.type}
              </span>
              <span className="text-xs text-gray-500">
                {u.date || 'Recent'}
              </span>
            </div>
            <h3
              className="mb-2 text-white"
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "1rem",
                fontWeight: 700
              }}
            >
              {u.title}
            </h3>
            <p
              className="text-gray-400 text-sm leading-relaxed"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {u.desc}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3>No updates yet</h3>
            </div>
        )}
      </div>

    </section>
  )
}

