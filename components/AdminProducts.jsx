"use client"

import { useSession } from 'next-auth/react'
import { useState, useEffect, useMemo } from 'react'
import { Plus, X, Tag, Hash, Palette, IndianRupee, List } from 'lucide-react'
import clsx from 'clsx'
import StoreCard from './StoreCard'

import {
  collection, addDoc, deleteDoc, doc,
  updateDoc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

export default function AdminProducts({ isAdmin }) {
  const { data: session } = useSession()

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)

  const [selectedCat, setSelectedCat] = useState('all')

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'ranks', label: 'Ranks' },
    { id: 'keys', label: 'Keys' },
    { id: 'money', label: 'Money' },
    { id: 'bundles', label: 'Bundles' },
  ]

  const [formData, setFormData] = useState({
    name: '',
    cat: 'ranks',
    icon: '',
    price: 4.99,
    old: 0,
    badge: '',
    color: '#63b3ed',
    perks: ''
  })

  const previewP = useMemo(() => ({
    name: formData.name,
    cat: formData.cat,
    icon: formData.icon || '',
    price: Number(formData.price),
    perks: formData.perks.split('\\n').map(p => p.trim()).filter(Boolean),
    color: formData.color,
    badge: formData.badge,
    old: Number(formData.old) || undefined
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
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
      setProducts(data)
      setFilteredProducts(data)
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
      perks: ''
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
      perks: p.perks?.join('\\n') || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        old: Number(formData.old),
        perks: formData.perks
          .split('\\n')
          .map(p => p.trim())
          .filter(Boolean)
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
      alert('Error saving product')
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
    <section className='max-w-6xl mx-auto px-6 py-12'>
      
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-4 leading-tight' style={{ fontFamily: 'Orbitron, monospace' }}>
          Product Manager
        </h1>
        <div className='w-16 h-px mx-auto bg-gradient-to-r from-gray-400 to-transparent'/>
        <p className='text-gray-400 mt-4'>Manage your store products ({filteredProducts.length})</p>
      </div>

      {/* Add Button */}
      <div className='flex justify-center mb-8'>
        <button
          onClick={openAdd}
          className='flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl border border-white/20'
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-2 justify-center mb-8'>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedCat(id)}
            className={clsx(
              'px-4 py-2 rounded-md cursor-pointer text-xs font-medium transition-all border',
              selectedCat === id
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                : 'border-transparent bg-white/5 text-gray-400 hover:border-gray-500 hover:bg-white/10 hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className='h-48 flex items-center justify-center'>
          <span className='text-gray-500'>Loading...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className='text-center py-16'>
          <List size={48} className='mx-auto mb-4 text-gray-500' />
          <h3 className='text-lg font-medium text-gray-300 mb-2'>No products</h3>
          <p className='text-gray-500'>Get started by adding your first product</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {filteredProducts.map(p => (
            <StoreCard key={p.id} p={p} adminMode onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

{/* Modal */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

    <div className="w-full max-w-6xl h-[90vh] flex rounded-2xl border border-white/10 bg-[#030610]/90 backdrop-blur-xl overflow-hidden">

      {/* LEFT — FORM */}
      <div className="w-1/2 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-white text-lg"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              {editId ? "Edit Product" : "Add Product"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill details to update preview
            </p>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg hover:bg-white/5 transition"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAME */}
          <div>
            <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
              Name
            </label>
            <input
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-blue-400/40 focus:outline-none transition"
              placeholder="VIP Rank"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* ROW */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white focus:border-blue-400/40 outline-none"
                value={formData.cat}
                onChange={e => setFormData({ ...formData, cat: e.target.value })}
              >
                <option value="ranks">Ranks</option>
                <option value="keys">Keys</option>
                <option value="money">Money</option>
                <option value="bundles">Bundles</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
                Icon
              </label>
              <input
                required
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white text-center"
                placeholder="⭐"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>

          </div>

          {/* PRICE */}
          <div>
            <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
              Pricing
            </label>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white text-right"
                placeholder="Price"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white text-right"
                placeholder="Old"
                value={formData.old}
                onChange={e => setFormData({ ...formData, old: e.target.value })}
              />
            </div>
          </div>

          {/* STYLE */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
                Badge
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white"
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
              >
                <option value="">None</option>
                <option value="popular">Popular</option>
                <option value="sale">Sale</option>
                <option value="new">New</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
                Color
              </label>
              <input
                type="color"
                className="w-full h-[44px] rounded-lg border border-white/10 bg-transparent cursor-pointer"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

          </div>

          {/* PERKS */}
          <div>
            <label className="text-xs uppercase tracking-[0.1em] text-gray-400 mb-2 block">
              Perks
            </label>
            <textarea
              className="w-full px-4 py-3 h-28 rounded-lg bg-white/[0.04] border border-white/10 text-white resize-none"
              placeholder="One perk per line..."
              value={formData.perks}
              onChange={e => setFormData({ ...formData, perks: e.target.value })}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting || !formData.name || !formData.icon}
            className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium uppercase tracking-[0.08em] hover:bg-blue-600 transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Product"}
          </button>

        </form>
      </div>

      {/* RIGHT — PREVIEW */}
      <div className="w-1/2 border-l border-white/10 flex flex-col">

        <div className="p-6 border-b border-white/10">
          <h3
            className="text-white text-sm uppercase tracking-[0.1em]"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            Preview
          </h3>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          {previewP.name ? (
            <StoreCard p={previewP} />
          ) : (
            <div className="text-gray-500 text-sm text-center">
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

