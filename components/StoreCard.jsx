"use client"

import { Edit3, Trash2 } from 'lucide-react' 

export default function StoreCard({ p, adminMode = false, onEdit, onDelete }) {
  const perksPreview = p.perks.slice(0, 3)
  const perksCount = p.perks.length

  const badgeStyles = {
    new: "bg-green-500/20 border-green-400/50 text-green-400",
    popular: "bg-yellow-500/20 border-yellow-400/50 text-yellow-400 animate-pulse",
    sale: "bg-red-500/20 border-red-400/50 text-red-400"
  }

    return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden transition duration-300 hover:-translate-y-[6px] hover:border-blue-400/40">

      {/* TOP GLOW LINE */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* BADGE */}
      {p.badge && (
        <div className={`
          absolute top-3 right-3 px-3 py-1 rounded-full text-[0.65rem] uppercase font-bold tracking-[0.1em]
          ${p.badge === "popular" && "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"}
          ${p.badge === "new" && "bg-green-400/20 text-green-400 border border-green-400/30"}
          ${p.badge === "sale" && "bg-red-400/20 text-red-400 border border-red-400/30"}
        `}>
          {p.badge}
        </div>
      )}

      {/* BANNER */}
      <div
        className="h-[200px] flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${p.color}33, transparent)`
        }}
      >
        <span className="text-7xl drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          {p.icon}
        </span>
      </div>

      {/* BODY */}
      <div className="p-6">

        {/* TITLE */}
        <h3
          className="mb-3 text-white"
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "0.9rem",
            fontWeight: 700,
            letterSpacing: "0.08em"
          }}
        >
          {p.name}
        </h3>

        {/* PERKS */}
        <ul className="mb-5 space-y-2">
          {p.perks.map((perk, i) => (
            <li key={i} className="text-[0.82rem] text-gray-300 flex gap-2 items-center">
              <span className="text-blue-400 text-[0.5rem]">◆</span>
              {perk}
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className="flex items-center justify-between">

          {/* PRICE */}
          <div>
            <div
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "1.8rem",
                fontWeight: 700
              }}
            >
              ₹{p.price}
            </div>

            {p.old && (
              <div className="text-xs text-gray-500 line-through mt-1">
                ₹{p.old}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          {adminMode ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                className="p-2 text-blue-400 hover:text-blue-300 transition"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                className="p-2 text-red-400 hover:text-red-300 transition"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button className="px-5 py-2 text-[0.78rem] rounded-lg uppercase font-bold tracking-[0.08em] bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-[1px] hover:shadow-[0_4px_30px_rgba(59,130,246,0.5)] transition">
              Buy →
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
