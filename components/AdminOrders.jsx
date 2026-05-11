"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

  const [deletingId, setDeletingId] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [pendingDeleteOrderId, setPendingDeleteOrderId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const [mockModalOpen, setMockModalOpen] = useState(false)
  const [mockError, setMockError] = useState('')
  const [mockSubmitting, setMockSubmitting] = useState(false)

  const [mockUserId, setMockUserId] = useState('')
  const [mockName, setMockName] = useState('Mock Product')
  const [mockPrice, setMockPrice] = useState('100')
  const [mockQty, setMockQty] = useState('1')
  const [mockPaymentMethod, setMockPaymentMethod] = useState('razorpay')
  const [mockVerified, setMockVerified] = useState(true)

  const [mockOrderId, setMockOrderId] = useState('')

  const openDeleteModal = (orderId) => {
    setDeleteError('')
    setPendingDeleteOrderId(orderId)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setPendingDeleteOrderId(null)
    setDeleteError('')
  }

  const handleDelete = async () => {
    const orderId = pendingDeleteOrderId
    if (!orderId) return

    try {
      setDeletingId(orderId)
      setDeleteError('')

      // Lazy-load to avoid bundling server-only things into the client bundle too early
      const { deleteOrderById } = await import('@/lib/orders')
      const res = await deleteOrderById(orderId)

      if (!res?.ok) {
        setDeleteError(res?.error || 'Delete failed')
        return
      }

      // Refresh list
      const data = await getAllOrders()
      setOrders(data)
      closeDeleteModal()
    } catch (e) {
      console.error(e)
      setDeleteError('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddMock = async () => {
    setMockSubmitting(true)
    setMockError('')

    try {
      const { addMockPurchaseToUser } = await import('@/lib/orders')

      const priceNum = Number(mockPrice)
      const qtyNum = Number(mockQty)

      if (!mockUserId.trim()) {
        setMockError('Please enter User Id')
        return
      }
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        setMockError('Please enter a valid price')
        return
      }
      if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
        setMockError('Please enter a valid qty')
        return
      }

      const res = await addMockPurchaseToUser({
        userId: mockUserId.trim(),
        product: {
          id: Date.now().toString(),
          name: mockName,
          price: priceNum,
          qty: qtyNum,
          subtotal: priceNum * qtyNum,
          paymentMethod: mockPaymentMethod,
          verified: mockVerified,
          orderId:
            mockOrderId.trim() ||
            `${mockUserId.trim()}-${Date.now().toString()}`
        }
      })

      if (!res?.ok) {
        setMockError(res?.error || 'Add mock purchase failed')
        return
      }

      const data = await getAllOrders()
      setOrders(data)
      setMockModalOpen(false)
    } catch (e) {
      console.error(e)
      setMockError('Add mock purchase failed')
    } finally {
      setMockSubmitting(false)
    }
  }

  if (error) return <div className='text-red-400 p-8 text-center'>Error: {error}</div>

  return (
    <>
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

        <div className='mt-6 flex justify-center gap-3'>
          <button
            type='button'
            onClick={() => {
              setMockError('')
              setMockSubmitting(false)
              setMockModalOpen(true)
            }}
            className='px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/30 transition text-sm font-bold text-white'
          >
            + Add Mock Purchase
          </button>
        </div>
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
                  <th className='p-4 text-right font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={
                      `${order.userId || 'u'}-` +
                      `${order.orderId || order.orderID || 'noOrder'}-` +
                      `${order.paymentId || order.payment_id || 'noPayment'}-` +
                      `${order.product?.id || order.productId || 'noProduct'}-` +
                      i
                    }
                    className='border-b border-white/5 hover:bg-white/10 transition-colors'
                  >
                    <td className='p-4'>
                      <div className='font-medium text-white truncate'>{order.userName || 'Unknown User'}</div>
                      <div className='text-xs text-gray-400'>
                        {order.userId ? `${String(order.userId).slice(0, 8)}...` : '—'}
                      </div>
                    </td>

                    <td className='p-4'>
                      <div className='font-medium text-white'>{order.product?.name || 'N/A'}</div>
                      <div className='text-xs text-gray-400'>{order.product?.cat || ''}</div>
                    </td>

                    <td className='p-4 text-right'>
                      <div className='font-mono text-lg font-bold text-green-400'>
                        ₹{order.product?.price?.toFixed(2) || '0'}
                      </div>
                    </td>

                    <td className='p-4'>
                      <div className='text-sm text-gray-300'>{formatTimestamp(order.timestamp)}</div>
                    </td>

                    <td className='p-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className='inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/40 transition text-xs font-semibold text-blue-300'
                        >
                          View Details
                          <span aria-hidden className='text-blue-200'>→</span>
                        </Link>

                        <button
                          type='button'
                          onClick={() => openDeleteModal(order.orderId)}
                          disabled={deletingId === order.orderId}
                          className='inline-flex items-center justify-center px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition text-xs font-semibold text-red-200 disabled:opacity-60 disabled:cursor-not-allowed'
                          title='Delete order from user history'
                        >
                          {deletingId === order.orderId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>

    {/* DELETE POPUP MODAL */}
    {deleteModalOpen && (
      <div
        className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'
        role='dialog'
        aria-modal='true'
      >
        <div className='w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h3 className='text-lg font-bold text-white'>Delete this order?</h3>
              <p className='text-sm text-gray-400 mt-2'>
                This will remove the purchase from the user history and it will also disappear from this dashboard.
              </p>
            </div>

            <button
              type='button'
              onClick={closeDeleteModal}
              className='text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5'
              aria-label='Close'
            >
              ✕
            </button>
          </div>

          {deleteError ? (
            <div className='mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3'>
              {deleteError}
            </div>
          ) : null}

          <div className='mt-6 flex items-center justify-end gap-3'>
            <button
              type='button'
              onClick={closeDeleteModal}
              disabled={deletingId != null}
              className='px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition text-sm font-semibold text-gray-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={handleDelete}
              disabled={deletingId === pendingDeleteOrderId}
              className='px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition text-sm font-bold text-red-100 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {deletingId === pendingDeleteOrderId ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* MOCK ADD MODAL */}
    {mockModalOpen && (
      <div
        className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'
        role='dialog'
        aria-modal='true'
      >
        <div className='w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h3 className='text-lg font-bold text-white'>Add mock purchase</h3>
              <p className='text-sm text-gray-400 mt-2'>
                Creates a fake purchase entry for testing and recalculates points.
              </p>
            </div>

            <button
              type='button'
              onClick={() => {
                setMockModalOpen(false)
                setMockError('')
                setMockSubmitting(false)
              }}
              className='text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5'
              aria-label='Close'
            >
              ✕
            </button>
          </div>

          {mockError ? (
            <div className='mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3'>
              {mockError}
            </div>
          ) : null}

          <div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='md:col-span-2'>
              <label className='text-xs uppercase tracking-widest text-gray-400'>User Id (Discord)</label>
              <input
                value={mockUserId}
                onChange={(e) => setMockUserId(e.target.value)}
                placeholder='e.g. 1234567890'
                className='mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='text-xs uppercase tracking-widest text-gray-400'>Product name</label>
              <input
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                className='mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white'
              />
            </div>

            <div>
              <label className='text-xs uppercase tracking-widest text-gray-400'>Payment method</label>
              <input
                value={mockPaymentMethod}
                onChange={(e) => setMockPaymentMethod(e.target.value)}
                className='mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white'
              />
            </div>

            <div>
              <label className='text-xs uppercase tracking-widest text-gray-400'>Verified</label>
              <div className='mt-2 flex items-center gap-3 text-sm text-gray-200'>
                <input
                  type='checkbox'
                  checked={mockVerified}
                  onChange={(e) => setMockVerified(e.target.checked)}
                />
                <span>{mockVerified ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div>
              <label className='text-xs uppercase tracking-widest text-gray-400'>Price (₹)</label>
              <input
                value={mockPrice}
                onChange={(e) => setMockPrice(e.target.value)}
                inputMode='decimal'
                className='mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white'
              />
            </div>

            <div>
              <label className='text-xs uppercase tracking-widest text-gray-400'>Qty</label>
              <input
                value={mockQty}
                onChange={(e) => setMockQty(e.target.value)}
                inputMode='numeric'
                className='mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='text-xs uppercase tracking-widest text-gray-400'>OrderId (optional)</label>
              <input
                value={mockOrderId}
                onChange={(e) => setMockOrderId(e.target.value)}
                placeholder='Leave empty to auto-generate'
                className='mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm text-white'
              />
            </div>
          </div>

          <div className='mt-6 flex items-center justify-end gap-3'>
            <button
              type='button'
              onClick={() => {
                setMockModalOpen(false)
                setMockError('')
                setMockSubmitting(false)
              }}
              disabled={mockSubmitting}
              className='px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition text-sm font-semibold text-gray-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={handleAddMock}
              disabled={mockSubmitting}
              className='px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition text-sm font-bold text-blue-100 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {mockSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
