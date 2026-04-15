"use client"

const parsePerks = (perksString) => perksString.split(/\r?\n/).map(p => p.trim()).filter(Boolean);

import { useSession } from 'next-auth/react'
import { useState, useEffect, useMemo } from 'react'
import { Plus, X, List, Upload, Link } from 'lucide-react'
import clsx from 'clsx'
import StoreCard from './StoreCard'

import { AdminProductsSkeleton } from './Skeleton'

import {
  collection, addDoc, deleteDoc, doc,
  updateDoc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminProducts({ isAdmin }) {
  const { data: session } = useSession()

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'ranks', label: 'Ranks' },
    { id: 'keys', label: 'Keys' },
    { id: 'money', label: 'Money' },
    { id: 'bundles', label: 'Bundles' },
  ]

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [selectedCat, setSelectedCat] = useState('all')

  const [formData, setFormData] = useState({
    name: '',
    cat: 'ranks',
    icon: '',
    price: 4.99,
    old: 0,
    badge: '',
    color: '#63b3ed',
    perks: '',
    details: '',
    imageUrl: ''
  })

  const previewP = useMemo(() => ({
    name: formData.name,
    cat: formData.cat,
    icon: formData.icon || '',
    price: Number(formData.price),
    perks: parsePerks(formData.perks),
    color: formData.color,
    badge: formData.badge,
    old: Number(formData.old) || undefined,
    imageUrl: formData.imageUrl
  }), [formData])

  if (!isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-red-400 text-xl font-semibold'>Access Denied</div>
      </div>
    )
  }

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      console.log('Products loaded:', snap.docs.length)
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
      setProducts(data)
      setFilteredProducts(data)
      setLoading(false)
    }, (error) => {
      console.error('Products ERROR:', error)
      setError(error.message)
      setProducts([])
      setFilteredProducts([])
      setLoading(false)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    if (selectedCat === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.cat === selectedCat))
    }
  }, [products, selectedCat])

  const openAdd = () => {
    setEditId(null)
    setFormData({
      name: '',
      cat: 'ranks',
      icon: '',
      price: 4.99,
      old: 0,
      badge: '',
      color: '#63b3ed',
      perks: '',
      details: ''
    })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditId(p.id)
    setFormData({
      name: p.name || '',
      cat: p.cat || 'ranks',
      icon: p.icon || '',
      price: p.price || 4.99,
      old: p.old || 0,
      badge: p.badge || '',
      color: p.color || '#63b3ed',
      perks: Array.isArray(p.perks) ? p.perks.join('\n') : (typeof p.perks === 'string' ? p.perks : ''),
      details: p.details || '',
      imageUrl: p.imageUrl || ''
    })
    setShowModal(true)
  }

  const handleImageUrl = (e) => {
    setFormData(prev => ({ ...prev, imageUrl: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = {
        ...formData,
        imageUrl: formData.imageUrl || '',
        price: Number(formData.price),
        old: Number(formData.old) || null,
        perks: parsePerks(formData.perks),
        details: formData.details || ''
      }

      if (editId) {
        await updateDoc(doc(db, 'products', editId), data)
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp()
        })
      }

      setShowModal(false)
    } catch (err) {
      console.error(err)
      alert('Error saving product: ' + err.message)
    }
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch {
      alert('Delete failed')
    }
  }

  return (
    <section className='max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12'>
      <div className='flex items-center gap-3 mb-12'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center cursor-pointer gap-2 text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back to Admin
        </button>
      </div>

      <div className='text-center mb-8 md:mb-12'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-4 leading-tight' style={{ fontFamily: 'Orbitron, monospace' }}>
          Product Manager
        </h1>
        <div className='w-16 h-px mx-auto bg-gradient-to-r from-gray-400 to-transparent' />
        <p className='text-gray-400 mt-4 text-sm md:text-base'>Manage your store products ({filteredProducts.length})</p>
      </div>

      <div className='flex justify-center mb-6 md:mb-8'>
        <button
          onClick={openAdd}
          className='flex items-center cursor-pointer gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl border border-white/20 text-sm md:text-base'
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className='flex flex-wrap gap-2 justify-center mb-6 md:mb-8'>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedCat(id)}
            className={clsx(
              'px-3 md:px-4 py-2 rounded-md cursor-pointer text-xs font-medium transition-all border',
              selectedCat === id
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                : 'border-transparent bg-white/5 text-gray-400 hover:border-gray-500 hover:bg-white/10 hover:text-white'
            )}
          >
            {label}
        </button>
        ))}
      </div>

      {error ? (
        <div className='text-center py-16 text-red-400'>
          <h3>Error loading products</h3>
          <p className='text-sm mt-2'>{error}</p>
          <p className='text-gray-400 mt-4'>Check Console (F12) + Firebase Rules</p>
        </div>
      ) : loading ? (
        <>
          <AdminProductsSkeleton />
        </>
      ) : filteredProducts.length === 0 ? (
        <div className='text-center py-16'>
          <List size={48} className='mx-auto mb-4 text-gray-500' />
          <h3 className='text-lg font-medium text-gray-300 mb-2'>No products</h3>
          <p className='text-gray-500'>Get started by adding your first product</p>
        </div>
      ) : (
        <div className='admin-product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8'>
          {filteredProducts.map(p => (
            <StoreCard key={p.id} p={p} adminMode onEdit={openEdit} />
          ))}
        </div>
      )}

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4'>

          <div className='w-full max-w-6xl h-[95vh] md:h-[90vh] flex flex-col lg:flex-row rounded-2xl border border-white/10 bg-[#030610]/90 backdrop-blur-xl overflow-hidden'>

            <div className='w-full lg:w-1/2 p-4 lg:p-8 flex-1 overflow-y-auto'>

              <div className='flex items-center justify-between mb-6 md:mb-8'>
                <div>
                  <h2
                    className='text-white text-base md:text-lg'
                    style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700 }}
                  >
                    {editId ? 'Edit Product' : 'Add Product'}
                  </h2>
                  <p className='text-gray-500 text-xs md:text-sm mt-1'>
                    Fill details to update preview
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className='p-2 rounded-lg hover:bg-white/5 transition'
                >
                  <X size={18} className='text-gray-400' />
                </button>
              </div>

              {/* {form} */}

              <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
                <div>
                  <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                    Name
                  </label>
                  <input
                    required
                    className='w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-blue-400/40 focus:outline-none transition'
                    placeholder='Item Name'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                      Category
                    </label>
                    <select
                      className='w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-white focus:border-blue-400/40 outline-none'
                      value={formData.cat}
                      onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
                    >
                      <option value='ranks'>Ranks</option>
                      <option value='keys'>Keys</option>
                      <option value='money'>Money</option>
                      <option value='bundles'>Bundles</option>
                    </select>
                  </div>
                  <div>
                    <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                      Icon
                    </label>
                    <select
                      required
                      className='w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-white focus:border-blue-400/40 outline-none'
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    >
                      <optgroup label='Ranks'>
                        <option value='Crown'>♔ Crown</option>
                        <option value='Star'>✪ Star</option>
                        <option value='Award'>⟁ Award</option>
                        <option value='Diamond'>◇ Diamond</option>
                      </optgroup>
                      <optgroup label='Keys'>
                        <option value='Key'>⛌ Key</option>
                        <option value='Lock'>⛑ Lock</option>
                        <option value='Shield'>🛡 Shield</option>
                      </optgroup>
                      <optgroup label='Money'>
                        <option value='DollarSign'>$ Dollar Sign</option>
                        <option value='Coins'>¢ Coins</option>
                        <option value='CreditCard'>▱ Credit Card</option>
                      </optgroup>
                      <optgroup label='Bundles'>
                        <option value='Package'>⬚ Package</option>
                        <option value='Gift'>◈ Gift</option>
                        <option value='ShoppingBag'>⬓ Shopping Bag</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                    Pricing
                  </label>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex flex-col'>
                      <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-1 block'>Discounted Price</label>
                      <input
                        type='number'
                        step='0.01'
                        className='w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white text-left'
                        placeholder='₹99'
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-1 block'>Original Price</label>
                      <input
                        type='number'
                        step='0.01'
                        className='w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white text-left'
                        placeholder='₹199'
                        value={formData.old}
                        onChange={(e) => setFormData({ ...formData, old: e.target.value })}
                      />
                    </div>
                  </div>
                  {formData.old > 0 && formData.price > 0 && (
                    <div className='mt-2 p-2 bg-blue-500/10 border border-blue-400/30 rounded-lg'>
                      <span className='text-sm text-blue-300 font-medium'>
                        Discount: {Math.round(((formData.old - formData.price) / formData.old * 100))}%
                      </span>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                      Badge
                    </label>
                    <select
                      className='w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-white focus:border-blue-400/40 outline-none'
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    >
                      <option value=''>None</option>
                      <option value='popular'>Popular</option>
                      <option value='sale'>Sale</option>
                      <option value='new'>New</option>
                    </select>
                  </div>
                  <div>
                    <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                      Color
                    </label>
                    <input
                      type='color'
                      className='w-full h-[44px] rounded-lg border border-white/10 bg-transparent cursor-pointer'
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                    Perks
                  </label>
                  <textarea
                    className='w-full px-4 py-3 min-h-[100px] max-h-[200px] rounded-lg bg-white/[0.04] border border-white/10 text-white resize-vertical'
                    placeholder='One perk per line...'
                    value={formData.perks}
                    onChange={(e) => setFormData({ ...formData, perks: e.target.value })}
                  />
                </div>

                <div>
                  <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                    Details
                  </label>
                  <textarea
                    className='w-full px-4 py-3 h-32 rounded-lg bg-white/[0.04] border border-white/10 text-white resize-none'
                    placeholder='Detailed description...'
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                </div>
                                <div>
                  <label className='text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block'>
                    Product Image (URL)
                  </label>
                  <input
                    className='w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-blue-400/40 focus:outline-none transition'
                    placeholder='Paste image URL (Google Drive, Dropbox, Imgur/CDN)'
                    value={formData.imageUrl}
                    onChange={handleImageUrl}
                  />
                  <p className='text-xs text-gray-400 mt-1'>Google Drive/Dropbox supported via proxy</p>
                </div>

                <button
                  type='submit'
                  disabled={!formData.name || !formData.icon || submitting}
                  className='w-full py-3 rounded-lg bg-blue-500 text-white font-medium uppercase tracking-[0.08em] hover:bg-blue-600 transition disabled:opacity-50'
                >
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>

              </form>
            </div>

            <div className='w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col flex-1 min-h-0'>
              <div className='p-4 md:p-6 border-b border-white/10'>
                <h3 className='text-white text-sm uppercase tracking-[0.1em]' style={{ fontFamily: 'Orbitron, monospace' }}>
                  Preview
                </h3>
              </div>
              <div className='flex-1 p-8 md:p-24 overflow-auto flex items-center justify-center'>
                {previewP.name ? (
                  <StoreCard p={previewP} />
                ) : (
                  <div className='text-gray-500 text-sm text-center'>
                    Enter details to preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
