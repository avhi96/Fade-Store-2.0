"use client"

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { ADMIN_IDS } from '@/lib/admins'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state:', firebaseUser?.uid)
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const isAdmin = user ? ADMIN_IDS.includes(user.uid) : false

  return { user, loading, isAdmin }
}