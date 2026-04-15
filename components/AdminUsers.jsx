"use client"

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Users, Ban, ShoppingBag, Star, Search, ArrowLeft } from 'lucide-react'
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { ADMIN_IDS } from '@/lib/admins'


export default function AdminUsers({ isAdmin }) {
  const { data: session } = useSession()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [filteredUsers, setFilteredUsers] = useState([])

  const activeCount = users.filter(u => !u.isBanned).length
  const bannedCount = users.filter(u => u.isBanned).length
  const buyersCount = users.filter(u => (u.purchases?.length || 0) > 0).length
  const pointsCount = users.filter(u => u.points > 0).length

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setUsers(data)
      setFilteredUsers(data)
      setLoading(false)
    }, (error) => {
      console.warn('Firestore users read permission issue:', error.message)
      setUsers([])
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    let results = users

    // Filter by status/points/purchases
    if (filter === 'banned') {
      results = results.filter(u => u.isBanned)
    } else if (filter === 'active') {
      results = results.filter(u => !u.isBanned)
    } else if (filter === 'points') {
      results = results.filter(u => u.points > 0).sort((a, b) => b.points - a.points)
    } else if (filter === 'buyers') {
      results = results.filter(u => (u.purchases?.length || 0) > 0)
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(u => 
        u.name?.toLowerCase().includes(term) || 
        u.email?.toLowerCase().includes(term) ||
        u.discordId?.includes(term)
      )
    }

    setFilteredUsers(results)
  }, [searchTerm, filter, users])




  const deleteUser = async (userId) => {
    if (!confirm('Delete this user and all data?')) return
    await deleteDoc(doc(db, 'users', userId))
  }

  if (!isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-red-400 text-xl font-semibold'>Access Denied</div>
      </div>
    )
  }

  return (
    <section className='max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12'>
      <div className='mb-8'>
        <Link href='/admin' className='inline-flex items-center gap-2 text-gray-400 hover:text-white transition p-3 rounded-lg hover:bg-white/5'>
          <ArrowLeft size={20} />
          <span>Back to Admin</span>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 
          className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-4' 
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          Users Management
        </h1>
        <p className='text-gray-400'>Manage all users, bans, and activity ({filteredUsers.length})</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 max-w-4xl mx-auto">
        {/* Filter tabs */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${filter === 'all' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-400 hover:text-white'}`}
          >
            All ({filteredUsers.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${filter === 'active' ? 'bg-green-400/20 text-green-300 border border-green-400/30' : 'text-gray-400 hover:text-green-300'}`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('points')}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${filter === 'points' ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'text-gray-400 hover:text-yellow-300'}`}
          >
            Top Points ({pointsCount})
          </button>
          <button
            onClick={() => setFilter('buyers')}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${filter === 'buyers' ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30' : 'text-gray-400 hover:text-blue-300'}`}
          >
            Buyers ({buyersCount})
          </button>
        </div>
        
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className='h-64 flex items-center justify-center'>
          <div className='text-gray-500'>Loading users...</div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className='text-center py-20'>
          <Users className='w-16 h-16 mx-auto mb-4 text-gray-500' />
          <h3 className='text-xl font-medium text-gray-300 mb-2'>No users found</h3>
          <p className='text-gray-500'>Try adjusting your search or create some users</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 font-medium text-gray-300">User</th>
                <th className="text-left p-4 font-medium text-gray-300">Email</th>
                <th className="text-left p-4 font-medium text-gray-300">Discord ID</th>
                <th className="text-left p-4 font-medium text-gray-300">Points</th>
                <th className="text-left p-4 font-medium text-gray-300">Purchases</th>
                <th className="text-left p-4 font-medium text-gray-300">Status</th>
                <th className="text-left p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4">
                    <div className="font-medium text-white">{user.name || 'N/A'}</div>
                    <div className="text-gray-400 text-sm">{user.id}</div>
                  </td>
                  <td className="p-4 text-gray-300">{user.email || 'N/A'}</td>
                  <td className="p-4 text-gray-300 font-mono text-sm">{user.discordId || 'N/A'}</td>
                  <td className="p-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold">
                      {user.points || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}/purchases`} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                      <ShoppingBag size={14} />
                      {user.purchases?.length || 0}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.isBanned 
                        ? 'bg-red-400/20 text-red-400 border border-red-400/30' 
                        : 'bg-green-400/20 text-green-400 border border-green-400/30'
                    }`}>
                      {user.isBanned ? 'BANNED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">

{ADMIN_IDS.includes(user.discordId) ? (
                        <span className="text-gray-500 text-xs px-2 py-1 bg-gray-800 rounded">Admin</span>
                      ) : (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 rounded-lg cursor-pointer bg-red-500/20 hover:bg-red-500/40 text-red-300 transition text-sm"
                        >
                          Delete
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-12 text-xs text-gray-500 text-center">
        Users data stored in Firestore 'users' collection. Points/purchases tracked automatically.
      </div>
    </section>
  )
}
