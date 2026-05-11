"use client"

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { createUser } from '@/lib/users'
import { ADMIN_IDS } from '@/lib/admins'

export default function UserSync() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.discordId) return

    const discordId = session.user.discordId
    const isAdmin = ADMIN_IDS.includes(discordId)

    createUser({
      id: discordId,
      discordId,
      name: session.user.name,
      email: session.user.email,
      // Admin model
      role: isAdmin ? 'admin' : 'user',
      isAdmin,
    })
  }, [session?.user?.id])

  return null
}





