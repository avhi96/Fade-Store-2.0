"use client"

import BackgroundCanvas from '@/components/BackgroundCanvas'
import { AlertTriangle, Mail, RefreshCw, Shield } from 'lucide-react'

export default function MaintenanceScreen({ message = "Scheduled maintenance in progress. Services will resume shortly." }) {
  const handleRefresh = () => window.location.reload()

  return (
    <div className="fixed inset-0 z-50 text-white overflow-hidden">
      <BackgroundCanvas />

      {/* Grid Overlay (match your site) */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        
        <div className="w-full max-w-2xl text-center">

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-blue-300 text-xs tracking-widest uppercase mb-8">
            System Status
          </div>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
            <AlertTriangle className="w-10 h-10 text-blue-300" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Maintenance Mode
          </h1>

          {/* Message */}
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-10">
            {message}
          </p>

          {/* Status Card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl mb-10 text-left">
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center border border-blue-400/20">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold tracking-wide">
                  System Upgrade Active
                </h3>
                <p className="text-gray-400 text-xs">
                  Core services are temporarily unavailable
                </p>
              </div>
            </div>

            {/* Clean List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                Performance optimization
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Security updates
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-400" />
                Infrastructure upgrade
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                Feature deployment
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <a
              href={`mailto:admin@fadestore.com?subject=Maintenance%20Status`}
              className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:border-blue-400/40 hover:bg-blue-400/10 transition-all text-sm tracking-wide"
            >
              Contact Support
            </a>

            <button
              onClick={handleRefresh}
              className="px-6 py-3 rounded-lg bg-gradient-to-r cursor-pointer from-blue-500 to-blue-400/40 hover:opacity-90 transition-all text-sm tracking-wide"
            >
              Check Status
            </button>

          </div>

          {/* Footer */}
          <div className="mt-12 text-[10px] text-gray-500 tracking-[0.3em] uppercase">
            fade.store • maintenance
          </div>

        </div>
      </div>
    </div>
  )
}