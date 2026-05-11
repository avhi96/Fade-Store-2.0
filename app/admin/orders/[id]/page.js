import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { getOrderById } from "@/lib/orders"
import { ArrowLeft, ShoppingCart, User, ShoppingBag, Star } from "lucide-react"

export default async function OrderPage({ params }) {
  const { id: orderId } = await params
  const order = await getOrderById(orderId)
  
  if (!order) {
    return (
      <AdminAuthWrapper>
        <div className='min-h-screen flex items-center justify-center p-8'>
          <div className='text-center text-gray-400 max-w-md'>
            <ShoppingCart className='w-16 h-16 mx-auto mb-4 text-gray-500' />
            <h2 className='text-2xl font-bold text-white mb-2'>Order not found</h2>
            <p className='text-gray-500'>Order ID: <code className='bg-black px-2 py-1 rounded font-mono'>{orderId}</code></p>
          </div>
        </div>
      </AdminAuthWrapper>
    )
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const product = order.product
  const perks = Array.isArray(product.perks) ? product.perks : (typeof product.perks === 'string' ? product.perks.split('\n').filter(Boolean) : [])

  return (
    <AdminAuthWrapper>
      <div className='max-w-4xl mx-auto p-8'>
        {/* Back button */}
        <a href='/admin/orders' className='inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 p-3 rounded-lg hover:bg-white/5 transition'>
          <ArrowLeft size={20} />
          Back to Orders
        </a>

        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-white mb-2' style={{ fontFamily: 'Orbitron, monospace' }}>
            Order #{order.orderId.slice(-8)}
          </h1>
          <p className='text-gray-400 mb-2'>ID: <code className='bg-black px-3 py-1 rounded font-mono'>{order.orderId}</code></p>
          <p className='text-gray-400'>Placed on {formatTimestamp(order.timestamp)}</p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 mb-12'>
          {/* User Info */}
          <div className='bg-white/5 border border-white/10 rounded-2xl p-8'>
            <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
              <User size={24} />
              User Details
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='text-gray-400 text-sm uppercase tracking-wider'>Name</label>
                <div className='text-white font-medium mt-1'>{order.userName}</div>
              </div>
              <div>
                <label className='text-gray-400 text-sm uppercase tracking-wider'>User ID</label>
                <div className='text-gray-300 font-mono mt-1 break-all'>{order.userId}</div>
              </div>
              <div>
                <label className='text-gray-400 text-sm uppercase tracking-wider'>Points</label>
                <div className='text-yellow-400 font-bold mt-1 text-2xl'>{order.userPoints}</div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className='bg-white/5 border border-white/10 rounded-2xl p-8'>
            <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
              <ShoppingBag size={24} />
              Product Details
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='text-gray-400 text-sm uppercase tracking-wider'>Product</label>
                <div className='text-white font-bold mt-1 text-xl'>{product.name}</div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-gray-400 text-sm uppercase tracking-wider block mb-1'>Category</label>
                  <div className='text-gray-300 capitalize'>{product.cat}</div>
                </div>
                <div>
                  <label className='text-gray-400 text-sm uppercase tracking-wider block mb-1'>Price</label>
                  <div className='text-green-400 font-bold text-lg'>₹{product.price?.toFixed(2)}</div>
                </div>
              </div>
              {product.old && (
                <div>
                  <label className='text-gray-400 text-sm uppercase tracking-wider block mb-1'>Original</label>
                  <div className='text-gray-300 line-through'>₹{product.old.toFixed(2)}</div>
                </div>
              )}
              {product.badge && (
                <div>
                  <label className='text-gray-400 text-sm uppercase tracking-wider block mb-1'>Badge</label>
                  <div className='px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-medium inline-block capitalize'>
                    {product.badge}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Perks */}
        {perks.length > 0 && (
          <div className='bg-white/5 border border-white/10 rounded-2xl p-8 mb-12'>
            <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
              <Star size={24} />
              Perks Included
            </h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {perks.map((perk, i) => (
                <div key={i} className='p-4 bg-white/5 rounded-xl border border-white/10'>
                  <div className='text-green-400 font-medium'>{perk}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className='text-center p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl'>
          <h3 className='text-lg font-medium text-gray-300 mb-2'>Order Summary</h3>
          <div className='text-2xl font-bold text-white'>₹{product.price?.toFixed(2)}</div>
          <div className='text-sm text-gray-400 mt-2'>Paid by {order.userName} on {formatTimestamp(order.timestamp)}</div>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}

