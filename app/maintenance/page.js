import Navbar from '@/components/Navbar'
import { getStoreSettings } from '@/lib/settings'

export default async function MaintenancePage() {
  const settings = await getStoreSettings()
  const message = settings?.maintenanceMessage || 'Site under maintenance'

  return (
    <main className="min-h-screen relative pt-[70px] flex items-center justify-center px-4">
      <Navbar />
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
            Under Maintenance
          </h1>
          <p className="text-xl text-gray-400 max-w-sm mx-auto leading-relaxed">
            {message}
          </p>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Admins can access normally.</p>
          <p>Please check back soon.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:admin@fadestore.com" className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white/90 hover:bg-white/20 transition-all backdrop-blur text-sm font-medium">
            Contact Admin
          </a>
          <a href="/" className="px-6 py-3 bg-blue-500/90 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl text-sm">
            Refresh
          </a>
        </div>
      </div>
    </main>
  )
}
