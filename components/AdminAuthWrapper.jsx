"use client"

import { useSession } from 'next-auth/react'
import { ADMIN_IDS } from '@/lib/admins'

export default function AdminAuthWrapper({ children }) {
  const {
    data: session,
    status,
  } = useSession()

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-400'>
        Checking admin access...
      </div>
    )
  }

  const discordId =
    session?.user?.discordId ||
    session?.user?.id ||
    ''

  if (!ADMIN_IDS.includes(discordId)) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-400 text-xl'>
        Access Denied
      </div>
    )
  }

  return children || null
}
