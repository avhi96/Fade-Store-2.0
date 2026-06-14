"use client"

import { useState, useEffect } from 'react'
import {
  Users,
  ShoppingCart,
  DollarSign,
  Settings,
  Plus,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import {
  getAllOrders,
  getOrderAmount,
  getOrderBuyerName,
  getOrderProductName,
  isFadePointsOrder,
} from '@/lib/orders'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllOrders()
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load orders')
        setLoading(false)
      })
  }, [])

  const totalRevenue = orders.reduce((sum, order) => {

    if (isFadePointsOrder(order)) return sum

    return sum + getOrderAmount(order)

  }, 0)
  const uniqueUsers = new Set(orders.map((o) => o.userId)).size
  const recentOrders = [...orders]
    .sort((a, b) => {
      const normalize = (v) => {

        if (!v) return 0

        // Number timestamp
        if (typeof v === 'number') {
          return v
        }

        // Firestore Timestamp
        if (typeof v?.toMillis === 'function') {
          return v.toMillis()
        }

        // Firestore seconds object
        if (typeof v?.seconds === 'number') {
          return v.seconds * 1000
        }

        // ISO date string
        if (typeof v === 'string') {
          const parsed = Date.parse(v)
          return Number.isFinite(parsed) ? parsed : 0
        }

        return 0
      }

      return normalize(b.timestamp) - normalize(a.timestamp)
    })
    .slice(0, 4)

  const revenueValue = loading ? 'Loading...' : orders.length > 0 ? `₹${totalRevenue.toFixed(2)}` : '0'
  const ordersValue = loading ? 'Loading...' : orders.length > 0 ? orders.length : '0'
  const usersValue = loading ? 'Loading...' : uniqueUsers > 0 ? uniqueUsers : '0'
  const pointsValue = loading ? 'Loading...' : (orders.length > 0 ? 'Calculated' : '0')

  if (error) {
    return (
      <section className="max-w-[1300px] mx-auto px-6 py-24">
        <div className="text-red-400">Error loading admin data: {error}</div>
      </section>
    )
  }

  return (
    <section className="max-w-[1300px] mx-auto px-6 py-24">

      {/* 🔷 HEADER */}
      <div className="mb-16">

        <div className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-3">
          Admin Panel
        </div>

        <h1
          className="text-white"
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "clamp(1.8rem,3vw,2.6rem)",
            fontWeight: 700
          }}
        >
          Dashboard Control
        </h1>

        <div className="w-[60px] h-[2px] mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-12">

        <Stat icon={DollarSign} label="Revenue" value={revenueValue} />
        <Stat icon={ShoppingCart} label="Total Orders" value={ordersValue} />
        <Stat icon={Users} label="Unique Users" value={usersValue} />
        <Stat icon={BarChart3} label="Points" value={pointsValue} />


      </div>

      {/*  MAIN GRID */}
      <div className="grid md:grid-cols-[1fr_320px] gap-8">

        {/*  LEFT SIDE */}
        <div className="flex flex-col gap-6">

          {/* RECENT ORDERS */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <h3
              className="text-white mb-6"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              Recent Orders
            </h3>

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-gray-400">Loading recent orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-gray-400">No purchases yet</div>
              ) : (
                recentOrders.map((order, i) => (
                  <div
                    key={
                      `${order.userId || 'u'}-` +
                      `${order.orderId || order.orderID || 'noOrder'}-` +
                      `${order.paymentId || order.payment_id || 'noPayment'}-` +
                      `${order.items?.[0]?.id || order.product?.id || 'noProduct'}-` +
                      i
                    }
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="text-sm text-gray-300">{getOrderBuyerName(order)}</div>
                    <div className="text-white font-semibold">{getOrderProductName(order)}</div>
                    <div className="text-xs text-gray-400">

                      {isFadePointsOrder(order) ? (
                        <>
                          {getOrderAmount(order).toFixed(0)} FP
                        </>
                      ) : (
                        <>
                          ₹{getOrderAmount(order).toFixed(2)}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">

          {/* QUICK ACTIONS */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <h3
              className="text-white mb-6"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/products" className="block">
                <ActionBtn icon={Plus} label="Add Product" />
              </Link>
              <Link href="/admin/users" className="block">
                <ActionBtn icon={Users} label="Manage Users" />
              </Link>
              <Link href="/admin/orders" className="block">
                <ActionBtn icon={ShoppingCart} label="View Orders" />
              </Link>
              <Link href="/admin/updates" className="block">
                <ActionBtn icon={BarChart3} label="Site Updates" />
              </Link>
              <Link href="/admin/settings" className="block">
                <ActionBtn icon={Settings} label="Store Settings" />
              </Link>
            </div>

          </div>

          {/* SYSTEM STATUS */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">

            <h3
              className="text-white mb-4"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              System Status
            </h3>

            <div className="flex items-center gap-2 text-green-400 text-sm">
              ● All Systems Operational
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

/* COMPONENTS */

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center gap-4 hover:border-blue-400/40 transition">

      <div className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,179,237,0.4)]">
        <Icon size={18} className="text-white" />
      </div>

      <div>
        <div className="text-gray-400 text-xs uppercase tracking-[0.08em]">
          {label}
        </div>
        <div className="text-white font-bold">{value}</div>
      </div>

    </div>
  )
}

function ActionBtn({ icon: Icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.03] text-gray-300 hover:border-blue-400/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all group">
      <Icon size={16} className="group-hover:scale-110 transition-transform" />
      {label}
    </button>
  )
}
