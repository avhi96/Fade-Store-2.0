"use client"

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Percent, Tag, AlertTriangle, Globe, Save, Users } from 'lucide-react'
import { getStoreSettings, updateStoreSettings } from '@/lib/settings'

function SettingCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all ${className}`}>
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
      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
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
    <div className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-blue-400/30 transition-all">
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
  const [activeTab, setActiveTab] = useState('general')

  // Load settings
  useEffect(() => {
    getStoreSettings().then(data => {
      setSettings({
        taxRate: 0,
        globalDiscount: 0,
        announcement: '',
        maintenanceMode: false,
        maintenanceMessage: '',
        welcomeMessage: '',
        currency: '₹',
        partners: [],
        promoCodes: [],
        redeemCodes: [],
        ...(data || {})
      })
      setLoading(false)
    }).catch((err) => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaveStatus('')
  }, [])

  const addPartner = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      partners: [
        ...(prev.partners || []),
        {
          id: crypto.randomUUID(),
          name: '',
          tag: '',
          url: ''
        }
      ]
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
    setSaveStatus("")

    try {
      const success = await updateStoreSettings(settings)

      setSaveStatus(
        success
          ? "Saved successfully!"
          : "Failed to save."
      )
    } catch (err) {
      console.error(err)
      setSaveStatus("Failed to save.")
    } finally {
      setSaving(false)
    }
  }, [settings])

  if (loading) {
    return (
      <div className="min-h-screen pt-[70px] flex items-center justify-center">
        <div className="text-gray-400 text-lg animate-pulse">Loading settings...</div>
      </div>
    )
  }

  return (
    <main className="max-w-[1300px] mx-auto px-6 py-24">
      {/* HEADER */}
      <div className="mb-16">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Admin
        </Link>

        <div className="text-[0.7rem] tracking-[0.25em] uppercase text-blue-400 mb-3">
          Admin Settings
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h1
              className="text-white"
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 700
              }}
            >
              Store Configuration
            </h1>

            {saveStatus && (
              <div
                className={`mt-3 text-sm ${saveStatus.includes('success')
                  ? 'text-green-400'
                  : 'text-red-400'
                  }`}
              >
                {saveStatus}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              h-[46px]
              min-w-[160px]
              px-6
              rounded-xl
              bg-blue-500
              hover:bg-blue-400
              text-white
              font-semibold
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
              inline-flex
              items-center
              justify-center
              gap-2
              shadow-lg
              hover:shadow-blue-500/20
            "
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {/* CONTENT */}
      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-10">

        {[
          ['general', 'General'],
          ['partners', 'Partners'],
          ['promos', 'Promos'],
          ['redeem', 'Redeem Codes'],
        ].map(([id, label]) => (

          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
        px-5
        py-3
        rounded-xl
        font-semibold
        transition-all
        border

        ${activeTab === id
                ? 'bg-blue-500 text-white border-blue-400'
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-blue-400/40 hover:text-white'
              }
      `}
          >
            {label}
          </button>

        ))}

      </div>
      <div>
        <div className="space-y-8">

          {activeTab === 'general' && (
            <>
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
            </>
          )}

          {activeTab === 'partners' && (
            <>
              {/* PARTNERS */}
              <div>
                <SettingCard title="Partners">
                  <SettingSection icon={<Users size={18} />} title="Partner Program" description="Manage partner links and affiliates">
                    <div className="space-y-4">
                      {(settings.partners || []).map((partner, index) => (
                        <PartnerRow
                          key={partner.id ?? index}
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
            </>
          )}
          {activeTab === 'promos' && (
            <>
              {/* PROMO CODES */}
              <div className="mt-8">
                <SettingCard title="Promo Codes">

                  <SettingSection
                    icon={<Percent size={18} />}
                    title="Discount Promos"
                    description="Manage checkout discount promo codes"
                  >

                    <div className="space-y-4">

                      {(settings.promoCodes || []).map((promo, index) => (

                        <div
                          key={promo.id ?? index}
                          className="p-4 rounded-xl bg-white/5 border border-white/10"
                        >

                          <div className="grid md:grid-cols-2 gap-3">

                            <InputField
                              label="Promo Code"
                              value={promo.code || ''}
                              onChange={(e) => {
                                const updated = [...settings.promoCodes]

                                updated[index] = {
                                  ...updated[index],
                                  code: e.target.value.toUpperCase(),
                                }

                                updateSetting("promoCodes", updated)
                              }}
                            />

                            <InputField
                              label="Discount Value"
                              type="number"
                              value={promo.discountValue || 0}
                              onChange={(e) => {
                                const updated = [...settings.promoCodes]

                                updated[index] = {
                                  ...updated[index],
                                  discountValue: Number(e.target.value),
                                }

                                updateSetting('promoCodes', updated)
                              }}
                            />

                            <select
                              value={promo.discountType || 'percentage'}
                              onChange={(e) => {
                                const updated = [...settings.promoCodes]

                                updated[index] = {
                                  ...updated[index],
                                  discountType: e.target.value,
                                }

                                updateSetting('promoCodes', updated)
                              }}
                              className="
    w-full
    px-4
    py-3
    rounded-xl
    bg-[#111827]
    border
    border-white/10
    text-white
    outline-none
    appearance-none
    focus:border-blue-400/50
  "
                              style={{
                                backgroundColor: '#111827',
                                color: 'white',
                              }}
                            >

                              <option
                                value="percentage"
                                style={{
                                  backgroundColor: '#111827',
                                  color: 'white',
                                }}
                              >
                                Percentage
                              </option>

                              <option
                                value="fixed"
                                style={{
                                  backgroundColor: '#111827',
                                  color: 'white',
                                }}
                              >
                                Fixed ₹
                              </option>

                            </select>
                            <InputField
                              label="Max Uses"
                              type="number"
                              value={promo.maxUses || 1}
                              onChange={(e) => {
                                const updated = [...settings.promoCodes]

                                updated[index] = {
                                  ...updated[index],
                                  maxUses: Number(e.target.value),
                                }

                                updateSetting('promoCodes', updated)
                              }}
                            />

                          </div>

                          <button
                            onClick={() => {
                              const updated = settings.promoCodes.filter((_, i) => i !== index)
                              updateSetting('promoCodes', updated)
                            }}
                            className="mt-4 text-red-400 text-sm"
                          >
                            Remove Promo
                          </button>

                        </div>
                      ))}

                      <button
                        onClick={() => {
                          updateSetting('promoCodes', [
                            ...(settings.promoCodes || []),
                            {
                              id: crypto.randomUUID(),
                              code: '',
                              discountType: 'percentage',
                              discountValue: 10,
                              maxUses: 1,
                              usedBy: [],
                              active: true,
                            }
                          ])
                        }}
                        className="w-full p-4 rounded-xl border border-dashed border-blue-400/40 text-blue-300"
                      >
                        + Add Promo Code
                      </button>

                    </div>
                  </SettingSection>
                </SettingCard>
              </div>
            </>
          )}
          {activeTab === 'redeem' && (
            <>
              {/* REDEEM CODES */}
              <div className="mt-8">
                <SettingCard title="Redeem Codes">

                  <SettingSection
                    icon={<Tag size={18} />}
                    title="Redeem Rewards"
                    description="Users redeem these for rewards or commands"
                  >

                    <div className="space-y-4">

                      {(settings.redeemCodes || []).map((code, index) => (

                        <div
                          key={code.id ?? index}
                          className="p-4 rounded-xl bg-white/5 border border-white/10"
                        >

                          <div className="grid md:grid-cols-2 gap-3">

                            <InputField
                              label="Redeem Code"
                              value={code.code || ''}
                              onChange={(e) => {
                                const updated = [...settings.redeemCodes]

                                updated[index] = {
                                  ...updated[index],
                                  code: e.target.value.toUpperCase(),
                                }

                                updateSetting('redeemCodes', updated)
                              }}
                            />

                            <InputField
                              label="Reward Name"
                              value={code.reward || ''}
                              onChange={(e) => {
                                const updated = [...settings.redeemCodes]
                                updated[index] = {
                                  ...updated[index],
                                  reward: e.target.value,
                                }
                                updateSetting('redeemCodes', updated)
                              }}
                            />

                            <InputField
                              label="Server Command"
                              value={code.command || ''}
                              onChange={(e) => {
                                const updated = [...settings.redeemCodes]
                                updated[index] = {
                                  ...updated[index],
                                  command: e.target.value,
                                }
                                updateSetting('redeemCodes', updated)
                              }}
                              placeholder="lp user {player} parent add vip"
                            />

                            <InputField
                              label="Max Uses"
                              type="number"
                              value={code.maxUses || 1}
                              onChange={(e) => {
                                const updated = [...settings.redeemCodes]
                                updated[index] = {
                                  ...updated[index],
                                  maxUses: Number(e.target.value),
                                }
                                updateSetting('redeemCodes', updated)
                              }}
                            />

                          </div>

                          <button
                            onClick={() => {
                              const updated = settings.redeemCodes.filter((_, i) => i !== index)
                              updateSetting('redeemCodes', updated)
                            }}
                            className="mt-4 text-red-400 text-sm"
                          >
                            Remove Redeem Code
                          </button>

                        </div>
                      ))}

                      <button
                        onClick={() => {
                          updateSetting('redeemCodes', [
                            ...(settings.redeemCodes || []),
                            {
                              id: crypto.randomUUID(),
                              code: '',
                              reward: '',
                              command: '',
                              maxUses: 1,
                              usedBy: [],
                              active: true,
                            }
                          ])
                        }}
                        className="w-full p-4 rounded-xl border border-dashed border-cyan-400/40 text-cyan-300"
                      >
                        + Add Redeem Code
                      </button>

                    </div>
                  </SettingSection>
                </SettingCard>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
