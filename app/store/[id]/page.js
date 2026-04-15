"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ArrowLeft } from "lucide-react"
import * as Lucide from "lucide-react"
import Navbar from "@/components/Navbar"
import Image from "next/image"
import Skeleton from "@/components/Skeleton"
import { ProductDetailSkeleton } from "@/components/Skeleton"

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
  ShoppingBag: Lucide.ShoppingBag
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  // Load cart
  useEffect(() => {
    const stored = localStorage.getItem("cartItems")
    if (stored) setCart(JSON.parse(stored))
  }, [])

  // Fetch product
  useEffect(() => {
    if (!productId) return

    const ref = doc(db, "products", productId)

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setProduct({ id: productId, ...snap.data() })
      } else {
        setProduct(null)
      }
      setLoading(false)
    })

    return unsub
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    const existing = cart.find((i) => i.id === product.id)

    let newCart
    if (existing) {
      newCart = cart.map((i) =>
        i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i
      )
    } else {
      newCart = [...cart, { ...product, qty: 1 }]
    }

    setCart(newCart)
    localStorage.setItem("cartItems", JSON.stringify(newCart))
  }

  if (loading) {
    return (
      <>
        <Navbar />
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
        <Navbar />
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
      <Navbar />

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

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl cursor-pointer bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
              >
                {isInCart ? "Added" : "Add to Cart"}
              </button>

              <button className="flex-1 py-3 rounded-xl cursor-pointer bg-white/10 text-white hover:bg-white/20 transition">
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* PERKS */}
        {perksArray.length > 0 && (
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
        )}

        {/* DESCRIPTION */}
        {product.details && (
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
        )}

      </main>
    </>
  )
}