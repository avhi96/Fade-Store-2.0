"use client"

import AdminAuthWrapper from './AdminAuthWrapper'
import AdminUpdates from './AdminUpdates'

export default function AdminUpdatesWrapper() {
  return (
    <AdminAuthWrapper>
      <AdminUpdates isAdmin={true} />
    </AdminAuthWrapper>
  )
}

