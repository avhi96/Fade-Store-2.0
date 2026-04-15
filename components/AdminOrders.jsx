"use client"

import { useState, useEffect } from 'react'
import { ShoppingCart, User, DollarSign, Calendar, Clock } from 'lucide-react'
import { getAllOrders } from '@/lib/orders'

export default function AdminOrders({ isAdmin }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  if (!isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-red-400 text-xl font-semibold'>Access Denied</div>
      </div>
    )
  }

  useEffect(() => {
    getAllOrders().then(data => {
      setOrders(data)
      setLoading(false)
    }).catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [])

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString()
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.product?.price || 0), 0).toFixed(2)

  if (error) return <div className='text-red-400 p-8 text-center'>Error: {error}</div>

  return (
    <section className='max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12'>
      {/* BACK TO ADMIN HEADER */}
      <div className="flex items-center gap-3 mb-12">
        <button
          onClick={() => window.history.back()}
          className="flex cursor-pointer items-center gap-2 text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin
        </button>
      </div>
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-4' style={{ fontFamily: 'Orbitron, monospace' }}>
          Orders Dashboard
        </h1>
        <div className='w-20 h-px mx-auto bg-gradient-to-r from-gray-400 to-transparent'/>
        <p className='text-gray-400 mt-4'>All user purchases ({orders.length})</p>
      </div>

      <div className='grid md:grid-cols-4 gap-4 mb-8'>
        <div className='p-6 rounded-xl border border-white/10 bg-white/5'>
          <ShoppingCart size={24} className='text-blue-400 mb-2' />
          <div className='text-2xl font-bold text-white'>{orders.length}</div>
          <div className='text-gray-400 text-sm'>Total Orders</div>
        </div>
        <div className='p-6 rounded-xl border border-white/10 bg-white/5'>
          <User size={24} className='text-green-400 mb-2' />
          <div className='text-2xl font-bold text-white'>{new Set(orders.map(o => o.userId)).size}</div>
          <div className='text-gray-400 text-sm'>Unique Buyers</div>
        </div>
        <div className='p-6 rounded-xl border border-white/10 bg-white/5'>
          <DollarSign size={24} className='text-yellow-400 mb-2' />
          <div className='text-2xl font-bold text-white'>₹{totalRevenue}</div>
          <div className='text-gray-400 text-sm'>Revenue</div>
        </div>
        <div className='p-6 rounded-xl border border-white/10 bg-white/5'>
          <Clock size={24} className='text-purple-400 mb-2' />
          <div className='text-2xl font-bold text-white'>{orders.length > 0 && formatTimestamp(orders[0].timestamp).split(', ')[0]}</div>
          <div className='text-gray-400 text-sm'>Latest Order</div>
        </div>
      </div>

      <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
        {loading ? (
          <div className='p-12 text-center text-gray-400'>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className='p-16 text-center'>
            <ShoppingCart size={64} className='mx-auto mb-4 text-gray-500' />
            <h3 className='text-xl font-medium text-gray-300 mb-2'>No orders yet</h3>
            <p className='text-gray-500'>First purchase will appear here</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-white/10 bg-white/5 uppercase text-xs tracking-wider text-gray-300'>
                  <th className='p-4 text-left font-medium'>User</th>
                  <th className='p-4 text-left font-medium'>Product</th>
                  <th className='p-4 text-right font-medium'>Price</th>
                  <th className='p-4 text-left font-medium'>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i} className='border-b border-white/5 hover:bg-white/10 transition-colors'>
                    <td className='p-4'>
                      <div className='font-medium text-white truncate'>{order.userName}</div>
                      <div className='text-xs text-gray-400'>{order.userId.slice(0,8)}...</div>
                    </td>
                    <td className='p-4'>
                      <div className='font-medium text-white'>{order.product?.name || 'N/A'}</div>
                      <div className='text-xs text-gray-400'>{order.product?.cat || ''}</div>
                    </td>
                    <td className='p-4 text-right'>
                      <div className='font-mono text-lg font-bold text-green-400'>₹{order.product?.price?.toFixed(2) || '0'}</div>
                    </td>
                    <td className='p-4'>
                      <div className='text-sm text-gray-300'>{formatTimestamp(order.timestamp)}</div>
                      <Link href={`/admin/orders/${order.orderId}`} className='block mt-2 text-blue-400 hover:text-blue-300 text-xs font-medium underline'>
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
