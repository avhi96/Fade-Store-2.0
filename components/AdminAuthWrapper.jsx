"use client"

import { useSession } from 'next-auth/react'
import { ADMIN_IDS } from '@/lib/admins'
import AdminProducts from './AdminProducts'

export default function AdminAuthWrapper() {
  const { data: session } = useSession()
  
  if (!session || !ADMIN_IDS.includes(session.user?.discordId ?? '')) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-400 text-xl'>
        Access Denied
      </div>
    )
  }

  return <AdminProducts isAdmin={true} />
}
