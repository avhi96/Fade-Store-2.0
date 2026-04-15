import { getStoreSettings } from '@/lib/settings'
import { NextResponse } from 'next/server'

export async function GET() {
  const settings = await getStoreSettings()
  return NextResponse.json({
    maintenanceMode: settings?.maintenanceMode || false,
    message: settings?.maintenanceMessage || 'Site under maintenance'
  })
}
