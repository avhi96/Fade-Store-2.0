"use client"

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Percent, Tag, DollarSign, AlertTriangle, Megaphone, Globe, Save, Users, Eye, MessageSquare } from 'lucide-react'
import { getStoreSettings, updateStoreSettings } from '@/lib/settings'

function SettingCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/50 backdrop-blur-xl p-6 shadow-2xl hover:shadow-blue-500/10 transition-all ${className}`}>
      <h3 className="flex items-center gap-2 text-white font-bold text-lg mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
        {children.props?.icon || <Globe size={20} />}
        {title}
      </h3>
      {children}
    </div>
  )
}

function SettingSection({ icon, title, description, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="text-blue-400 mt-0.5 flex-shrink-0">{icon}</div>
        <div>
          <div className="font-semibold text-white text-sm uppercase tracking-wider">{title}</div>
          <p className="text-gray-400 text-xs">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', suffix, placeholder, className = '' }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className={`relative ${className}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-blue-400/50 focus:outline-none transition-all backdrop-blur text-sm"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange, suffix, min = 0 }) {
  return (
    <InputField
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(Math.max(min, parseFloat(e.target.value) || min))}
      step="0.01"
      suffix={suffix}
    />
  )
}

function PartnerRow({ partner, index, onUpdate, onRemove }) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-400/30 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <InputField label="Name" value={partner.name || ''} onChange={(e) => onUpdate('name', e.target.value)} />
        <InputField label="Tag" value={partner.tag || ''} onChange={(e) => onUpdate('tag', e.target.value)} />
        <InputField label="URL" value={partner.url || ''} onChange={(e) => onUpdate('url', e.target.value)} placeholder="https://..." />
      </div>
      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1 rounded-lg border border-red-400/30 hover:bg-red-500/10 transition-all ml-auto"
      >
        Remove Partner
      </button>
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    taxRate: 0,
    globalDiscount: 0,
    announcement: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    welcomeMessage: '',
    currency: '₹',
    partners: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  // Load settings
  useEffect(() => {
    getStoreSettings().then(data => {
      setSettings(data || {})
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaveStatus('')
  }, [])

  const addPartner = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      partners: [...(prev.partners || []), { name: '', tag: '', url: '' }]
    }))
  }, [])

  const updatePartner = useCallback((index, field, value) => {
    setSettings(prev => {
      const partners = [...(prev.partners || [])]
      partners[index] = { ...partners[index], [field]: value }
      return { ...prev, partners }
    })
  }, [])

  const removePartner = useCallback((index) => {
    setSettings(prev => {
      const partners = (prev.partners || []).filter((_, i) => i !== index)
      return { ...prev, partners }
    })
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveStatus('')
    const success = await updateStoreSettings(settings)
    setSaving(false)
    setSaveStatus(success ? 'Saved successfully!' : 'Failed to save.')
  }, [settings])

  if (loading) {
    return (
      <div className="min-h-screen pt-[70px] flex items-center justify-center">
        <div className="text-gray-400 text-lg animate-pulse">Loading settings...</div>
      </div>
    )
  }

  return (
    <main className="pt-[70px] min-h-screen bg-gradient-to-b from-black via-[#0a0f1a] to-black">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all backdrop-blur">
            <ArrowLeft size={18} />
            Back to Admin
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              Store Settings
            </h1>
            <p className="text-xl text-gray-400 max-w-md">Configure store-wide settings, maintenance, and partner programs.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-700 transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
        {saveStatus && (
          <div className={`mt-4 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
            saveStatus.includes('success') ? 'bg-green-500/10 border-green-400/30 text-green-300' : 'bg-red-500/10 border-red-400/30 text-red-300'
          }`}>
            {saveStatus}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* MAINTENANCE & MESSAGES */}
          <div className="space-y-8">
            {/* MAINTENANCE */}
            <SettingCard title="Maintenance Mode">
              <SettingSection icon={<AlertTriangle size={18} />} title="Store Status" description="Enable to temporarily disable store access">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    id="maintenance"
                    className="w-5 h-5 rounded accent-blue-500 bg-white/10 border-white/20"
                    checked={settings.maintenanceMode || false}
                    onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                  />
                  <label htmlFor="maintenance" className="text-lg font-bold text-white cursor-pointer select-none flex-1">
                    Maintenance Mode {settings.maintenanceMode ? 'ON' : 'OFF'}
                  </label>
                </div>
                <InputField
                  label="Maintenance Message"
                  value={settings.maintenanceMessage || ''}
                  onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                  placeholder="Store temporarily unavailable..."
                  className="mt-3"
                />
              </SettingSection>
            </SettingCard>


          </div>

          {/* PARTNERS */}
          <div>
            <SettingCard title="Partners">
              <SettingSection icon={<Users size={18} />} title="Partner Program" description="Manage partner links and affiliates">
                <div className="space-y-4">
                  {(settings.partners || []).map((partner, index) => (
                    <PartnerRow
                      key={index}
                      partner={partner}
                      index={index}
                      onUpdate={(field, value) => updatePartner(index, field, value)}
                      onRemove={() => removePartner(index)}
                    />
                  ))}
                  <button
                    onClick={addPartner}
                    className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-dashed border-blue-400/40 rounded-2xl text-blue-300 hover:from-blue-500/30 hover:border-blue-400/60 hover:text-blue-200 transition-all flex items-center justify-center gap-2 font-medium text-sm group"
                  >
                    <span className="group-hover:scale-110 transition-transform">+</span>
                    Add New Partner
                  </button>
                  {(settings.partners || []).length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-600/30 rounded-2xl">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-sm mb-3">No partners yet</p>
                      <div className="text-xs">Click above to get started</div>
                    </div>
                  )}
                </div>
              </SettingSection>
            </SettingCard>
          </div>
        </div>
      </div>
    </main>
  )
}
