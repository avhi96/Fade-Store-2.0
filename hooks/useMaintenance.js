"use client"

import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useMaintenance() {
  const [maintenance, setMaintenance] = useState(false)
  const [message, setMessage] = useState('Store under maintenance')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const settingsRef = doc(db, 'settings/store')
    const unsubscribe = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setMaintenance(!!data.maintenanceMode)
        setMessage(data.maintenanceMessage || 'Store under maintenance')
      } else {
        setMaintenance(false)
      }
      setLoading(false)
    }, (error) => {
      console.error('Maintenance snapshot error:', error)
      setMaintenance(false)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { maintenance, message, loading }
}
