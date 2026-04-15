"use client"

import { useSession } from 'next-auth/react'
import { ADMIN_IDS } from '@/lib/admins'

export default function AdminAuthWrapper({ children }) {
  const { data: session } = useSession()
  
// Temporarily bypass for testing - remove after confirming session
  console.log('AdminAuthWrapper session:', session?.user?.discordId)
  return children || null

  return children || null
}
