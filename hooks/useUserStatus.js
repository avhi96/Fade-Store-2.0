"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useUserStatus() {
  const [isBanned, setIsBanned] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only for client-side fallback if needed
    setLoading(false)
  }, [])

  return { isBanned, loading }
}


