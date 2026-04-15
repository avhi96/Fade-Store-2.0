// Edge runtime compatible - no Firebase Admin SDK needed
export async function getStoreSettingsServer() {
  try {
    // Use env vars for edge runtime (set via admin panel → sync to env)
    // For full Firestore: use API route fetch in middleware cache
    const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'
    return { 
      maintenanceMode,
      maintenanceMessage: process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE || 'Site under maintenance. Back soon!'
    }
  } catch (error) {
    console.error('Server settings fetch error:', error)
    return { maintenanceMode: false }
  }
}
