"use client"

import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as Lucide from 'lucide-react'
import Image from 'next/image'

const iconMap = {
  Crown: Lucide.Crown,
  Star: Lucide.Star,
  Award: Lucide.Award,
  Diamond: Lucide.Diamond,
  Key: Lucide.Key,
  Lock: Lucide.Lock,
  Shield: Lucide.Shield,
  DollarSign: Lucide.DollarSign,
  Coins: Lucide.Coins,
  CreditCard: Lucide.CreditCard,
  Package: Lucide.Package,
  Gift: Lucide.Gift,
  ShoppingBag: Lucide.ShoppingBag,
  Zap: Lucide.Zap,
  TrendingUp: Lucide.TrendingUp,
  Heart: Lucide.Heart,
  Flame: Lucide.Flame,
  Bolt: Lucide.Bolt
}

export default function StoreCard({ p, adminMode = false, onEdit, onDelete, onAddCart, isInCart = false }) {
  const router = useRouter()
  const IconComponent = p.icon && iconMap[p.icon] ? iconMap[p.icon] : null
  const perksArray = Array.isArray(p.perks)
    ? p.perks
    : typeof p.perks === 'string'
      ? p.perks.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      : []

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-[6px] hover:border-blue-400/40 hover:shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
      {p.badge && (
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs uppercase font-bold tracking-wide 
          ${p.badge === 'popular' && 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50 animate-pulse'}
          ${p.badge === 'new' && 'bg-green-400/20 text-green-400 border border-green-400/50'}
          ${p.badge === 'sale' && 'bg-red-400/20 text-red-400 border border-red-400/50'}
        `}>
          {p.badge}
        </div>
      )}
      {/* Optional small product image */}
      {p.imageUrl && (
        <div className="absolute top-4 left-4 z-10">
{/* <img
            src={p.imageUrl.startsWith('https://drive.google.com') || p.imageUrl.includes('dropbox.com') ? `/api/proxy-image?url=${encodeURIComponent(p.imageUrl)}` : p.imageUrl}
            alt={p.name}
            className="w-12 h-12 object-cover rounded-xl shadow-lg ring-1 ring-white/30"
          /> */}
        </div>
      )}
      <div
        className="h-[200px] flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${p.color}44, transparent)`
        }}
      >
        {IconComponent ? (
          <IconComponent
            size={72}
            className="drop-shadow-2xl text-white/90"
            strokeWidth={2}
          />
        ) : p.icon ? (
          <span className="text-7xl drop-shadow-2xl">
            {p.icon}
          </span>
        ) : (
          <div className="text-gray-500 text-2xl">?</div>
        )}
      </div>

      <div className="p-6">
        <h3
          className="mb-3 font-mono text-lg font-black uppercase tracking-wider text-white truncate"
          style={{
            fontFamily: 'Orbitron, monospace'
          }}
        >
          {p.name}
        </h3>

        <ul className="mb-6 space-y-1.5">
          {perksArray.slice(0, 4).map((perk, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
              <Lucide.Diamond size={10} className="text-blue-400 flex-shrink-0" />
              <span className="leading-relaxed whitespace-pre-line break-words max-w-none">{perk}</span>
            </li>
          ))}
          {perksArray.length > 4 && (
            <li className="text-xs text-gray-500">+{perksArray.length - 4} more</li>
          )}
        </ul>

        <div className="flex items-end justify-between pt-2 border-t border-white/10">
          <div>
            <div
              className="font-mono text-2xl font-black tracking-tight"
              style={{
                fontFamily: 'Orbitron, monospace'
              }}
            >
              ₹{p.price}
            </div>

            {p.old && p.old > p.price && (
              <div className="inline-flex items-center gap-1">
                <span className="text-xs text-gray-400 line-through">₹{p.old}</span>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                  {Math.round(((p.old - p.price) / p.old * 100))}% off
                </span>
              </div>
            )}
          </div>

          {adminMode ? (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(p)
                }}
                className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => router.replace(`/store/${p.id}`)}
                className="flex-1 px-3 py-2 text-xs cursor-pointer rounded-lg uppercase font-bold tracking-wider border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all"
              >
                View Details
              </button>
              <button
                onClick={() => onAddCart?.(p)}
                className={`flex-1 px-3 py-2 text-xs cursor-pointer rounded-lg uppercase font-bold tracking-wider shadow-lg hover:shadow-xl transition-all border ${isInCart
                    ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 border-white/20'
                  }`}
              >
                {isInCart ? 'Added' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

