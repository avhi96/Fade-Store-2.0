'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Heart, ShoppingCart, CheckCircle } from "lucide-react"

export default function Checkout() {
  const router = useRouter()
  const { data: session } = useSession()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    
    const storedCart = localStorage.getItem("cartItems")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
    setLoading(false)
  }, [session, router])

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * item.qty, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    
    try {
      // Create order in Firebase (implement later)
      console.log("Creating order...", { cart, total: cartTotal, paymentMethod })
      
      // Clear cart
      localStorage.removeItem("cartItems")
      setCart([])
      
      router.push("/store?success=1")
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading checkout...</div>
      </div>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "Orbitron, monospace" }}>
          Checkout
        </h1>
        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Order Summary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Orbitron, monospace" }}>
            Order Summary
          </h2>
          
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-400">₹{Number(item.price).toFixed(2)} × {item.qty}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    ₹{(Number(item.price) * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-white/5 to-white/2 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-400 mb-3">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-white mb-6" style={{ fontFamily: "Orbitron, monospace" }}>
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "Orbitron, monospace" }}>
            Payment Method
          </h2>

          <div className="space-y-3 mb-8">
            <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl hover:border-cyan-400/50 cursor-pointer group">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-cyan-500 bg-gray-800 border-white/20 rounded focus:ring-cyan-400"
              />
              <div className="flex-1">
                <div className="font-semibold text-white">Razorpay</div>
                <div className="text-sm text-gray-400">Secure credit/debit cards, UPI, Wallets</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl hover:border-orange-400/50 cursor-pointer group">
              <input
                type="radio"
                name="payment"
                value="cashfree"
                checked={paymentMethod === "cashfree"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-orange-500 bg-gray-800 border-white/20 rounded focus:ring-orange-400"
              />
              <div className="flex-1">
                <div className="font-semibold text-white">Cashfree</div>
                <div className="text-sm text-gray-400">Net Banking, Cards, EMI options</div>
              </div>
            </label>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-black uppercase tracking-wider text-lg shadow-2xl hover:shadow-cyan-500/50 hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/20"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            <ShoppingCart size={20} className="inline mr-2" />
            Pay ₹{cartTotal.toFixed(2)} Now
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Secure checkout. Your data is encrypted.
          </p>
        </div>
      </div>
    </section>
  )
}

