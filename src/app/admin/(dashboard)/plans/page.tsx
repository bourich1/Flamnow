'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Sliders, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle, 
  Plus,
  Trash2
} from 'lucide-react'

function PricingPreview({ packages, focusedField }: { packages: any[], focusedField?: string | null }) {
  const getHighlight = (field: string, idx: number) => {
    return focusedField === `${field}-${idx}` ? 'ring-2 ring-[#ED3F27] rounded transition-all' : ''
  }
  return (
    <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6 text-left shadow-2xl">
      <div className="flex flex-col items-center text-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#ED3F27] font-mono">Partnerships</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-white font-display">Select Your Fuel Rate</h3>
      </div>
      <div className="space-y-4">
        {packages.map((pkg: any, idx: number) => (
          <div key={idx} className={`relative bg-[#0b0b0b] border rounded-xl p-5 flex flex-col gap-4 ${
            pkg.popular ? "border-[#ED3F27]/50" : "border-white/5"
          }`}>
            {pkg.popular && (
              <span className="absolute -top-2.5 right-4 bg-[#ED3F27] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-mono">
                Popular
              </span>
            )}
            <div>
              <h4 className={`text-sm font-black text-white uppercase tracking-tight font-display ${getHighlight('pkg.name', idx)}`}>{pkg.name || 'Package Name'}</h4>
              <p className={`text-white/60 text-[10px] mt-1 font-body ${getHighlight('pkg.desc', idx)}`}>{pkg.desc || 'Description'}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black text-white ${getHighlight('pkg.price', idx)}`}>{pkg.price || '$0'}</span>
              <span className={`text-[9px] text-white/60 font-bold uppercase tracking-wider font-mono ${getHighlight('pkg.term', idx)}`}>{pkg.term || 'term'}</span>
            </div>
            <ul className={`space-y-1.5 border-t border-white/5 pt-3 ${getHighlight('pkg.features', idx)}`}>
              {(pkg.features || []).slice(0, 3).map((f: string, fIdx: number) => (
                <li key={fIdx} className="text-[10px] text-white/60 flex items-center gap-1.5 font-body">
                  <span className="h-1 w-1 rounded-full bg-[#ED3F27]" />
                  {f}
                </li>
              ))}
              {(pkg.features || []).length > 3 && (
                <li className="text-[9px] text-white/30 italic font-body">+{pkg.features.length - 3} more deliverables</li>
              )}
            </ul>
          </div>
        ))}
        {packages.length === 0 && (
          <p className="text-white/30 text-xs italic text-center py-4 font-mono">No pricing packages configured.</p>
        )}
      </div>
    </div>
  )
}

export default function PlansAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [pricingPackages, setPricingPackages] = useState<any[]>([])

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'pricing_packages')
      
      if (error) throw error
      
      if (data && data.length > 0) {
        setPricingPackages(data[0].value || [])
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      setErrorMsg('Failed to sync plans from database.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    setActionLoading(true)

    const payloadPricing = {
      key: 'pricing_packages',
      value: pricingPackages,
      description: 'Pricing packages details'
    }

    try {
      const { error } = await supabase.from('site_settings').upsert(payloadPricing)
      if (error) throw error

      setSuccessMsg('Plans updated successfully.')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating plans')
    } finally {
      setActionLoading(false)
    }
  }

  const addPricingPackage = () => {
    setPricingPackages([...pricingPackages, { name: '', price: '', term: 'per project', desc: '', features: [], cta: 'Collaborate', popular: false }])
  }
  const removePricingPackage = (idx: number) => {
    setPricingPackages(pricingPackages.filter((_, i) => i !== idx))
  }
  const updatePricingPackage = (idx: number, field: string, val: any) => {
    const updated = [...pricingPackages]
    updated[idx] = { ...updated[idx], [field]: val }
    setPricingPackages(updated)
  }

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Sliders className="h-4 w-4 text-[#ED3F27]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Services Configuration</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            Plans & Pricing
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Manage the service plans and pricing packages.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#ED3F27] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving plans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <form onSubmit={handleSave} className="space-y-6">
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

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#121212] border border-white/5 p-4 rounded-xl">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Plans List ({pricingPackages.length})</span>
                  <button
                    type="button"
                    onClick={addPricingPackage}
                    className="flex items-center gap-1.5 border border-[#ED3F27]/30 bg-[#ED3F27]/10 hover:bg-[#ED3F27]/25 text-[#ED3F27] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Plan</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {pricingPackages.map((pkg, idx) => (
                    <div key={idx} className="bg-[#121212] border border-white/5 p-5 rounded-2xl space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removePricingPackage(idx)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 bg-[#121212] hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Plan Name</label>
                          <input
                            type="text"
                            value={pkg.name}
                            onFocus={() => setFocusedField(`pkg.name-${idx}`)}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => updatePricingPackage(idx, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#ED3F27]/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Price</label>
                          <input
                            type="text"
                            value={pkg.price}
                            onFocus={() => setFocusedField(`pkg.price-${idx}`)}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => updatePricingPackage(idx, 'price', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#ED3F27]/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Term (e.g. per month)</label>
                          <input
                            type="text"
                            value={pkg.term}
                            onFocus={() => setFocusedField(`pkg.term-${idx}`)}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => updatePricingPackage(idx, 'term', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#ED3F27]/50 font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <input
                            type="checkbox"
                            checked={pkg.popular}
                            onChange={(e) => updatePricingPackage(idx, 'popular', e.target.checked)}
                            className="h-4 w-4 accent-[#ED3F27] cursor-pointer"
                            id={`popular-${idx}`}
                          />
                          <label htmlFor={`popular-${idx}`} className="text-[10px] font-bold uppercase tracking-wider text-white/80 cursor-pointer">
                            Mark as Popular (Highlight)
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Description</label>
                        <textarea
                          rows={2}
                          value={pkg.desc}
                          onFocus={() => setFocusedField(`pkg.desc-${idx}`)}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => updatePricingPackage(idx, 'desc', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Features (One per line)</label>
                        <textarea
                          rows={4}
                          value={(pkg.features || []).join('\n')}
                          onFocus={() => setFocusedField(`pkg.features-${idx}`)}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => updatePricingPackage(idx, 'features', e.target.value.split('\n'))}
                          placeholder="List features..."
                          className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-[#ED3F27] hover:opacity-95 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 font-sans"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Plans</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                Live Card Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>
            <PricingPreview packages={pricingPackages} focusedField={focusedField}
            />
          </div>
        </div>
      )}
    </div>
  )
}
