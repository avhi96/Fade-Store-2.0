"use client"

import { useState, useEffect } from 'react'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

export function useMaintenance() {

  const [maintenance, setMaintenance] = useState(false)

  const [message, setMessage] = useState(
    'Store under maintenance'
  )

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchMaintenance = async () => {

      try {

        const settingsRef = doc(
          db,
          'settings/store'
        )

        const snap = await getDoc(settingsRef)

        if (snap.exists()) {

          const data = snap.data()

          setMaintenance(
            !!data.maintenanceMode
          )

          setMessage(
            data.maintenanceMessage ||
            'Store under maintenance'
          )

        } else {

          setMaintenance(false)
        }

      } catch (error) {

        console.error(
          'Maintenance fetch error:',
          error
        )

        setMaintenance(false)

      } finally {

        setLoading(false)
      }
    }

    fetchMaintenance()

  }, [])

  return {
    maintenance,
    message,
    loading
  }
}