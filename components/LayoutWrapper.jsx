"use client"

import { useAuth } from '@/hooks/useAuth'
import { useMaintenance } from '@/hooks/useMaintenance'
import { useSession } from 'next-auth/react'
import { ADMIN_IDS } from '@/lib/admins'
import MaintenanceScreen from '@/components/MaintenanceScreen'
import { useState, useEffect } from 'react'


export default function LayoutWrapper({ children }) {
  const { loading: authLoading, isAdmin: firebaseAdmin } = useAuth()
  const { maintenance, message: maintMessage, loading: maintLoading } = useMaintenance()
  const { data: session, status: sessionStatus } = useSession()
  
  const nextAuthAdmin = sessionStatus === 'authenticated' && 
    session?.user?.discordId && 
    ADMIN_IDS.includes(session.user.discordId)
  
  const isAdmin = firebaseAdmin || nextAuthAdmin
  
  const loading = authLoading || maintLoading || sessionStatus === 'loading'
  
  if (loading) {
    return null
  }
  
  if (maintenance && !isAdmin) {
    return <MaintenanceScreen message={maintMessage} />
  }
  
  return children
}

