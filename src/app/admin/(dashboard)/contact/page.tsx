'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Phone, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle,
  Mail,
  Globe
} from 'lucide-react'

export default function ContactAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [contactEmail, setContactEmail] = useState('hello@flamnow.com')
  const [contactPhone, setContactPhone] = useState('+1 (555) 019-2831')
  const [instagram, setInstagram] = useState('#')
  const [whatsapp, setWhatsapp] = useState('#')
  const [facebook, setFacebook] = useState('#')

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
      
      if (error) throw error
      
      const configList = data || []
      configList.forEach(item => {
        if (item.key === 'general_settings') {
          setContactEmail(item.value.contactEmail || '')
          setContactPhone(item.value.contactPhone || '')
        } else if (item.key === 'social_links') {
          setInstagram(item.value.instagram || '#')
          setWhatsapp(item.value.whatsapp || '#')
          setFacebook(item.value.facebook || '#')
        }
      })
    } catch (err) {
      console.error('Error fetching settings:', err)
      setErrorMsg('Failed to sync contact info from database.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    setActionLoading(true)

    try {
      // First, get the current general_settings to keep other fields
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'general_settings').single()
      const existingSettings = data?.value || {};

      const payloadGeneral = {
        key: 'general_settings',
        value: { ...existingSettings, contactEmail, contactPhone },
        description: 'Main corporate identity parameters'
      }

      const payloadSocials = {
        key: 'social_links',
        value: { instagram, whatsapp, facebook },
        description: 'Social networking accounts references'
      }

      const { error: err1 } = await supabase.from('site_settings').upsert(payloadGeneral)
      const { error: err2 } = await supabase.from('site_settings').upsert(payloadSocials)

      if (err1 || err2) throw err1 || err2

      setSuccessMsg('Contact information updated successfully.')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating contact info')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Phone className="h-4 w-4 text-[#ED3F27]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Contact Configuration</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            Contact & Socials
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Manage the contact details and social links shown on the site.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#ED3F27] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving info...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-4 flex items-start gap-2.5 font-sans">
              <Check className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex items-start gap-2.5 font-sans">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Mail className="h-4 w-4 text-[#FF9F0A]" />
              <h3 className="text-sm font-black uppercase tracking-wider font-display text-white">
                Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="hello@flamnow.com"
                  value={contactEmail}
                      onFocus={() => setFocusedField('contactEmail')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Contact Hotline / Phone
                </label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 012-3456"
                  value={contactPhone}
                      onFocus={() => setFocusedField('contactPhone')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Globe className="h-4 w-4 text-[#BF5AF2]" />
              <h3 className="text-sm font-black uppercase tracking-wider font-display text-white">
                Social Accounts
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={instagram}
                      onFocus={() => setFocusedField('instagram')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-widest text-white/60 block font-mono">
                  WhatsApp URL
                </label>
                <input
                  type="text"
                  value={whatsapp}
                      onFocus={() => setFocusedField('whatsapp')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Facebook URL
                </label>
                <input
                  type="text"
                  value={facebook}
                      onFocus={() => setFocusedField('facebook')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={actionLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-[#ED3F27] hover:opacity-95 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 font-sans"
            >
              {actionLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
