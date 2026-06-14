"use client"

import { useState, useEffect } from 'react'
import {
  Plus,
  X,
  Pencil,
  Trash2,
  ArrowLeft
} from 'lucide-react'

import {
  addUpdate,
  getStoreUpdates,
  deleteUpdate,
  updateUpdate
} from '@/lib/updates'

export default function AdminUpdates({ isAdmin }) {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    type: 'announcement',
    desc: '',
    date: ''
  })

  useEffect(() => {
    getStoreUpdates().then((data) => {
      setUpdates(data)
      setLoading(false)
    })
  }, [])

  if (!isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-400'>
        Access Denied
      </div>
    )
  }

  const openAdd = () => {
    setEditId(null)
    setFormData({
      title: '',
      type: 'announcement',
      desc: '',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    })
    setShowModal(true)
  }

  const openEdit = (u) => {
    setEditId(u.id)
    setFormData(u)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const success = editId
      ? await updateUpdate(editId, formData)
      : await addUpdate(formData)

    if (success) {
      setShowModal(false)
      getStoreUpdates().then(setUpdates)
    } else {
      alert('Error saving update. Check that you are signed in as an admin.')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this update?')) {
      const success =
        await deleteUpdate(id)

      if (success) {
        getStoreUpdates().then(setUpdates)
      } else {
        alert('Error deleting update. Check that you are signed in as an admin.')
      }
    }
  }

  return (
    <section className='max-w-[1100px] mx-auto px-6 py-20'>
      <div className='flex items-center justify-between mb-12'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition'
        >
          <ArrowLeft size={18} />
          Back to Admin
        </button>

        <h1
          className='text-white text-xl'
          style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700 }}
        >
          Updates
        </h1>

        <button
          onClick={openAdd}
          className='flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition'
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {loading ? (
        <div className='text-center text-gray-500'>Loading...</div>
      ) : (
        <div className='flex flex-col gap-4'>
          {updates.map((u) => (
            <div
              key={u.id}
              className='group p-5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-blue-400/40 transition'
            >
              <div className='flex justify-between items-start gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-xs px-2 py-1 rounded bg-blue-400/10 text-blue-400 uppercase tracking-[0.08em]'>
                      {u.type}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {u.date}
                    </span>
                  </div>
                  <h3 className='text-white font-semibold mb-1'>
                    {u.title}
                  </h3>
                  <p className='text-gray-400 text-sm leading-relaxed'>
                    {u.desc}
                  </p>
                </div>

                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition'>
                  <button
                    onClick={() => openEdit(u)}
                    className='p-2 rounded-lg cursor-pointer text-blue-400 hover:bg-blue-400/10 transition'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className='p-2 rounded-lg cursor-pointer text-red-400 hover:bg-red-400/10 transition'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
          <div className='w-full max-w-md p-6 rounded-xl border border-white/10 bg-[#030610]/90 backdrop-blur-xl'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-white text-lg'>
                {editId ? 'Edit Update' : 'Add Update'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='p-2 rounded-lg hover:bg-white/5'
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <input
                className='w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-blue-400/40 transition'
                placeholder='Title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <select
                className='
    w-full
    px-3
    py-2
    rounded-lg
    bg-[#111827]
    border
    border-white/10
    text-white
    text-sm
    outline-none
    focus:border-blue-400/40
    transition
    appearance-none
  '
                style={{
                  backgroundColor: '#111827',
                  color: 'white',
                }}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >

                <option
                  value='announcement'
                  style={{
                    backgroundColor: '#111827',
                    color: 'white',
                  }}
                >
                  Announcement
                </option>

                <option
                  value='patch'
                  style={{
                    backgroundColor: '#111827',
                    color: 'white',
                  }}
                >
                  Patch
                </option>

                <option
                  value='event'
                  style={{
                    backgroundColor: '#111827',
                    color: 'white',
                  }}
                >
                  Event
                </option>

              </select>
              <textarea
                className='w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-blue-400/40 transition min-h-[100px]'
                placeholder='Description'
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                required
              />
              <button className='w-full py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition'>
                {editId ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
