"use client"

import { useSession } from 'next-auth/react'
import { ADMIN_IDS } from '@/lib/admins'
import AdminUsers from './AdminUsers'

export default function AdminUsersWrapper() {
  const { data: session } = useSession()
  
  if (!session || !ADMIN_IDS.includes(session.user?.discordId ?? '')) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-400 text-xl'>
        Access Denied
      </div>
    )
  }

  return <AdminUsers isAdmin={true} />
}
