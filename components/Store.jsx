"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import clsx from "clsx"
import {
  ShoppingCart, X, Plus, Minus, Trash2,
  Tag, Package, Crown, Key, Coins, Layers,
  ChevronRight, ArrowRight, ShieldCheck, Zap, Star
} from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StoreCard from "./StoreCard"

const tabs = [
  { id: "ranks", label: "Ranks", Icon: Crown },
  { id: "keys", label: "Crate Keys", Icon: Key },
  { id: "money", label: "Money", Icon: Coins },
  { id: "bundles", label: "Bundles", Icon: Layers },
]

const fmt = (n) => `₹${Number(n).toFixed(2)}`

export default function Store() {
  const [active, setActive] = useState("ranks")
  const [productsData, setProductsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams?.get('openCart') === '1') setIsCartOpen(true)
    const cat = searchParams?.get('category')
    if (cat && tabs.some(t => t.id === cat)) setActive(cat)
  }, [searchParams])

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null
    if (stored) setCart(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('cartItems', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsub = onSnapshot(q,
      snap => { setProductsData(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) },
      err => { console.error(err); setError('Failed to load products'); setLoading(false) }
    )
    return unsub
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-slate-400">
      <Zap size={18} className="animate-pulse text-cyan-400" />
      <span className="text-sm tracking-widest uppercase font-medium">Loading store…</span>
    </div>
  )
  if (error) return (
    <div className="text-center py-32 text-red-400 text-sm">{error}</div>
  )

  const filtered = active === "all"
    ? productsData
    : productsData.filter(p => p.cat === active)

  const addToCart = (product) =>
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }]
    })

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, delta) =>
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    )

  const clearCart = () => setCart([])

  const subtotal = cart.reduce((s, i) => s + Number(i.price || 0) * i.qty, 0)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-20">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="text-center mb-16">
        <p
          className="text-[0.65rem] tracking-[0.35em] uppercase text-blue-400 mb-4 font-semibold"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Official Store
        </p>
        <h2
          className="text-white"
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.8rem,3.5vw,3rem)",
            fontWeight: 800,
            letterSpacing: "0.03em",
          }}
        >
          Choose Your Edge
        </h2>
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="w-[60px] h-[2px] mx-auto mt-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />
        </div>
      </div>

      {/* ── CATEGORY TABS ──────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-12 justify-center">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={clsx(
              "flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-xl text-[0.78rem] font-semibold uppercase tracking-[0.1em] border transition-all duration-200",
              active === id
                ? "border-blue-400/60 text-blue-300 bg-blue-400/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                : "border-white/8 text-slate-500 hover:border-white/20 hover:text-slate-300 hover:bg-white/5"
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID ───────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(p => (
          <StoreCard
            key={p.id}
            p={p}
            onAddCart={addToCart}
            isInCart={cart.some(i => i.id === p.id)}
          />
        ))}
      </div>

      {/* ── FLOATING CART FAB ──────────────────────────────────── */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-7 right-7 cursor-pointer z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl
                   bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold
                   shadow-[0_8px_32px_rgba(34,211,238,0.35)]
                   hover:shadow-[0_8px_40px_rgba(34,211,238,0.55)]
                   hover:from-blue-400 hover:to-blue-500
                   active:scale-95 transition-all duration-200 border border-white/20"
        style={{ fontFamily: "Orbitron, monospace", fontSize: "0.75rem", letterSpacing: "0.05em" }}
      >
        <ShoppingCart size={18} />
        <span className="hidden sm:inline">Cart</span>
        {itemCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-600 text-[0.65rem] font-black">
            {itemCount}
          </span>
        )}
      </button>

      {/* ── CART DRAWER ────────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">

          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* drawer panel */}
          <div className="relative ml-auto w-full max-w-[440px] h-full flex flex-col
                          bg-[#07101f] border-l border-white/8
                          shadow-[-24px_0_80px_rgba(0,0,0,0.7)]
                          animate-slideInRight">

            {/* ── DRAWER HEADER ──────────────────────────────── */}
            <div className="px-7 py-6 border-b border-white/8 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <ShoppingCart size={16} className="text-cyan-400" />
                </div>
                <div>
                  <h2
                    className="text-white text-sm font-bold tracking-wide"
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    Your Cart
                  </h2>
                  <p className="text-slate-500 text-[0.68rem] mt-0.5">
                    {itemCount} item{itemCount !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               text-slate-500 hover:text-red-400 hover:bg-red-400/10
                               transition-all text-[0.68rem] font-medium tracking-wide
                               border border-transparent hover:border-red-400/20"
                  >
                    <Trash2 size={11} />
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── DRAWER BODY ────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-7 py-5 space-y-3 custom-scrollbar">

              {cart.length === 0 ? (
                /* empty state */
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="relative mb-7">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      <ShoppingCart size={30} className="text-slate-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#07101f] border border-white/10 flex items-center justify-center">
                      <X size={10} className="text-slate-500" />
                    </div>
                  </div>
                  <h3
                    className="text-white font-bold mb-2 text-sm"
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    Nothing here yet
                  </h3>
                  <p className="text-slate-500 text-xs mb-8 max-w-[200px] leading-relaxed">
                    Head back to the store and grab something awesome.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                               bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                               text-white text-xs font-semibold tracking-widest uppercase transition-all"
                  >
                    Browse Store
                    <ArrowRight size={13} />
                  </button>
                </div>

              ) : (
                cart.map((item, i) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    index={i}
                    onRemove={removeItem}
                    onQty={updateQty}
                  />
                ))
              )}
            </div>

            {/* ── DRAWER FOOTER ──────────────────────────────── */}
            {cart.length > 0 && (
              <div className="flex-shrink-0 px-7 py-6 border-t border-white/8 bg-gradient-to-t from-black/50 to-transparent">

                {/* trust row */}
                <div className="flex items-center justify-center gap-6 mb-5">
                  {[
                    { icon: ShieldCheck, label: "Secure" },
                    { icon: Zap, label: "Instant" },
                    { icon: Tag, label: "Best Price" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-slate-500 text-[0.62rem] font-medium tracking-wide"
                    >
                      <Icon size={11} className="text-blue-500" />
                      {label}
                    </div>
                  ))}
                </div>

                {/* totals */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Platform fee</span>
                    <span className="text-emerald-400 font-semibold">Free</span>
                  </div>
                  <div className="h-px bg-white/8 my-2" />
                  <div className="flex justify-between items-center text-white font-bold">
                    <span
                      className="text-xs tracking-widest uppercase"
                      style={{ fontFamily: "Orbitron, monospace" }}
                    >
                      Total
                    </span>
                    <span
                      className="text-xl"
                      style={{ fontFamily: "Orbitron, monospace" }}
                    >
                      {fmt(subtotal)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/checkout">
                  <button
                    className="group w-full py-4 px-6 rounded-2xl relative overflow-hidden
                             bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500
                             text-white font-black text-xs tracking-widest uppercase
                             shadow-[0_4px_32px_rgba(34,211,238,0.28)]
                             hover:shadow-[0_4px_44px_rgba(34,211,238,0.5)]
                             active:scale-[0.98] transition-all duration-200 border border-white/20"
                    style={{ fontFamily: "Orbitron, monospace" }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Checkout
                      <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform duration-150" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </Link>

                <p className="text-center text-slate-600 text-[0.6rem] mt-3 tracking-wide">
                  By checking out you agree to our Terms of Service
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* keyframes */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.07);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>

    </section>
  )
}

/* ─── CartItem ────────────────────────────────────────────────── */
function CartItem({ item, index, onRemove, onQty }) {
  return (
    <div
      className="group relative bg-white/[0.04] hover:bg-white/[0.07]
                 border border-white/8 hover:border-white/[0.14]
                 rounded-2xl p-4 transition-all duration-200"
    >
      <div className="flex items-center gap-4">

        {/* icon box */}
        <div className="flex-shrink-0 w-11 h-11 rounded-xl
                        bg-gradient-to-br from-slate-800 to-slate-900
                        border border-white/10 flex items-center justify-center">
          <Package size={18} className="text-cyan-400/60" />
        </div>

        {/* name + price */}
        <div className="flex-1 min-w-0">
          <h4
            className="text-white text-xs font-semibold truncate"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            {item.name}
          </h4>
          <p className="text-slate-500 text-[0.68rem] mt-0.5">{fmt(item.price)} each</p>
        </div>

        {/* remove — visible on hover */}
        <button
          onClick={() => onRemove(item.id)}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center
                     rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10
                     transition-all duration-150 flex-shrink-0"
        >
          <X size={13} />
        </button>
      </div>

      {/* qty + line total */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">

        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/8 rounded-xl p-1">
          <button
            onClick={() => onQty(item.id, -1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-slate-400 hover:text-white hover:bg-white/10
                       transition-all active:scale-90"
          >
            <Minus size={11} />
          </button>
          <span
            className="text-white text-xs font-bold min-w-[22px] text-center"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            {item.qty}
          </span>
          <button
            onClick={() => onQty(item.id, 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       bg-cyan-500/15 hover:bg-cyan-500/35 text-cyan-400
                       transition-all active:scale-90"
          >
            <Plus size={11} />
          </button>
        </div>

        <span
          className="text-white font-black text-sm"
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          {fmt(item.price * item.qty)}
        </span>
      </div>
    </div>
  )
}