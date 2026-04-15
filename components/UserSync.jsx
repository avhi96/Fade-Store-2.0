"use client"

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { createUser } from '@/lib/users'

export default function UserSync() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.discordId) return

    createUser({
      id: session.user.discordId,
      discordId: session.user.discordId,
      name: session.user.name,
      email: session.user.email
    })
  }, [session?.user?.id])

  return null
}


