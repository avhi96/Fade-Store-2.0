"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/hooks/useCart"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ArrowLeft, Crown, Star, Award, Diamond, Key, Lock, Shield, DollarSign, Coins, CreditCard, Package, Gift, ShoppingBag } from "lucide-react"
import dynamic from 'next/dynamic'
import { NavbarSkeleton } from "@/components/Skeleton"


const NavbarDynamic = dynamic(() => import("@/components/Navbar"), {
  loading: NavbarSkeleton
})

import Image from "next/image"
import Skeleton from "@/components/Skeleton"
import { ProductDetailSkeleton } from "@/components/Skeleton"


const iconMap = {
  Crown,
  Star,
  Award,
  Diamond,
  Key,
  Lock,
  Shield,
  DollarSign,
  Coins,
  CreditCard,
  Package,
  Gift,
  ShoppingBag
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { cart, clearCart, addToCart } = useCart()
  const { data: session } = useSession()



// Fetch product with 5min localStorage cache
  useEffect(() => {
    if (!productId) return

    // Reset to avoid blank/stale UI during rapid navigation/back-forward
    setProduct(null)
    setLoading(true)

    let didCancel = false

    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    const cacheKey = `product_${productId}`
    const cachedStr = localStorage.getItem(cacheKey)

    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr)
        if (Date.now() - cached.cachedAt < CACHE_DURATION) {
          if (!didCancel) {
            setProduct(cached.data)
            setLoading(false)
          }
          return
        }
      } catch (e) {
        console.log('Cache invalid')
      }
    }

    const ref = doc(db, "products", productId)

    const unsub = onSnapshot(ref, (snap) => {
      if (didCancel) return
      if (snap.exists()) {
        const dataWithCache = {
          id: productId,
          ...snap.data(),
          cachedAt: Date.now(),
        }
        setProduct(dataWithCache)
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: dataWithCache, cachedAt: Date.now() })
        )
      } else {
        setProduct(null)
        localStorage.removeItem(cacheKey)
      }
      setLoading(false)
    })

    return () => {
      didCancel = true
      unsub()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product)
  }

  const handleBuyNow = () => {
    if (!session) {
      router.push('/login')
      return
    }

    // Avoid clearCart()+addToCart() timing window that can make checkout
    // briefly think the cart is empty.
    clearCart()
    addToCart({ ...product, qty: 1 })
    // Ensure cart/localStorage has been written before navigating.
    requestAnimationFrame(() => {
      router.push('/checkout')
    })
  }

  if (loading) {
    return (
      <>
        <NavbarDynamic />
        <Skeleton>
          <div className="pt-[70px]">
            <ProductDetailSkeleton />
          </div>
        </Skeleton>
      </>
    )
  }


  if (!product) {
    return (
      <>
        <NavbarDynamic />
        <div className="pt-[70px] min-h-screen flex items-center justify-center text-white">
          Product not found
        </div>
      </>
    )
  }


  const IconComponent =
    product.icon && iconMap[product.icon]
      ? iconMap[product.icon]
      : null

  //  FIXED perks parsing
  const perksArray = Array.isArray(product.perks)
    ? product.perks
    : typeof product.perks === "string"
    ? product.perks
        .split(/\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  const isInCart = cart.some((i) => i.id === product.id)

  return (
    <>
      <NavbarDynamic />

      <main className="pt-[70px] pb-16 px-6 max-w-[1200px] mx-auto">


        {/* BACK */}
        <button
          onClick={() => router.push('/store')}
          className="pt-7 mb-3 flex items-center cursor-pointer gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back to Store
        </button>

        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">

          {/* IMAGE */}
          <div>
            <div
              className="h-[320px] rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: `radial-gradient(circle at center, ${
                  product.color || "#3b82f6"
                }33, transparent)`
              }}
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-10"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />

              ) : IconComponent ? (
                <IconComponent size={120} className="text-white/80" />
              ) : null}
            </div>
          </div>

          {/* INFO */}
          <div>

            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              {product.name}
            </h1>

            {product.badge && (
              <span className="inline-block px-3 py-1 mb-4 text-xs rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/30 uppercase">
                {product.badge}
              </span>
            )}

            {/* PRICE */}
            <div className="mb-6">
              {product.cat === 'money' ? (
                <div className="space-y-3">
                  <div className="text-3xl font-black">
                    Redeem with Fade Points
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-4xl font-black text-cyan-300 font-mono">
                      {product.pointsCost ?? 0}
                    </div>
                    <div className="text-sm text-gray-400 bg-cyan-400/10 border border-cyan-400/30 rounded-full px-3 py-1 font-bold">
                      Fade Points
                    </div>
                    <div className="text-sm text-cyan-200 font-bold">
                      → {product.inGameMoneyAmount ?? 0} in-game money
                    </div>
                  </div>
                  {product.redemptionDescription ? (
                    <div className="text-gray-400 text-sm whitespace-pre-wrap">
                      {product.redemptionDescription}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Instant delivery after redemption.
                    </div>
                  )}
                </div>
              ) : (

                <>
                  <div className="text-4xl font-black">
                    ₹{product.price}
                  </div>

                  {product.old && (
                    <div className="flex gap-3 mt-2">
                      <span className="line-through text-gray-400">
                        ₹{product.old}
                      </span>
                      <span className="text-red-400 text-sm">
                        {Math.round(
                          ((product.old - product.price) / product.old) * 100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>


            {/* BUTTONS */}
            <div className="flex gap-4">

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl cursor-pointer bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
              >
                {isInCart ? "Added" : "Add to Cart"}
              </button>

              <button 
                onClick={handleBuyNow}
                className="flex-1 py-4 rounded-xl cursor-pointer font-bold tracking-wide bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02]"
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* PERKS */}
{perksArray.length > 0 && (
          <Suspense fallback={
            <div className="mb-16 animate-pulse">
              <div className="h-7 w-24 bg-gray-700/50 rounded animate-pulse mb-6" style={{ fontFamily: "Orbitron, monospace" }} />
              <div className="grid md:grid-cols-3 gap-4">
                <div className="h-20 p-4 rounded-xl bg-white/[0.04] border border-white/10" />
                <div className="h-20 p-4 rounded-xl bg-white/[0.04] border border-white/10" />
                <div className="h-20 p-4 rounded-xl bg-white/[0.04] border border-white/10" />
              </div>
            </div>
          }>
            <div className="mb-16">
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                Features
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {perksArray.map((perk, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex gap-3 items-start hover:border-blue-400/40 transition"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                    <span className="text-gray-300 text-sm">
                      {perk}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </Suspense>
        )}


        {/* DESCRIPTION */}
{product.details && (
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-7 w-28 bg-gray-700/50 rounded mb-6" style={{ fontFamily: "Orbitron, monospace" }} />
              <div className="h-32 p-6 rounded-2xl bg-white/[0.04] border border-white/10" />
            </div>
          }>
            <div>
              <h2
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                Description
              </h2>

              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-gray-300 whitespace-pre-wrap">
                {product.details}
              </div>
            </div>
          </Suspense>
        )}


      </main>
    </>
  )
}