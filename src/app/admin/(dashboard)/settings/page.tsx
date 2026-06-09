'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import NavbarPreview from '@/components/admin/previews/NavbarPreview'
import FooterPreview from '@/components/admin/previews/FooterPreview'
import { 
  Settings, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle, 
  Sliders,
  Globe,
  RefreshCw,
  Flame, 
  Rocket, 
  BarChart3, 
  HelpCircle,
  Compass, 
  Zap, 
  HeartHandshake,
  Plus,
  Trash2,
  List
} from 'lucide-react'

// Mapped icons for Live Previews
const iconMap: Record<string, React.ComponentType<any>> = {
  Flame,
  Rocket,
  BarChart3,
  Compass,
  Zap,
  HeartHandshake
}

// Inline live previews for the migrated sections
function WhyFlamnowPreview({ valueProps }: { valueProps: any[] }) {
  return (
    <div className="bg-bg-base border border-border-theme p-6 rounded-2xl space-y-6 text-left shadow-2xl">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">Value Proposition</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-foreground font-display">Why Flamnow.</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {valueProps.map((val: any, idx: number) => {
          const Icon = iconMap[val.iconName] || HelpCircle
          return (
            <div key={idx} className="bg-surface-base border border-border-theme rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-lg font-black text-white/10">{val.num || `0${idx + 1}`}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-tight mb-1 font-display">{val.title || 'Value Proposition Title'}</h4>
                <p className="text-muted-text text-xs leading-relaxed font-body">{val.desc || 'Provide a detailed description of this value.'}</p>
              </div>
            </div>
          )
        })}
        {valueProps.length === 0 && (
          <p className="text-muted-text/50 text-xs italic text-center py-4 font-mono">No value propositions configured.</p>
        )}
      </div>
    </div>
  )
}

function ProcessPreview({ steps }: { steps: any[] }) {
  return (
    <div className="bg-bg-base border border-border-theme p-6 rounded-2xl space-y-6 text-left shadow-2xl">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">Methodology</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-foreground font-display">Stoking the Flames.</h3>
      </div>
      <div className="relative pl-6 flex flex-col gap-6 border-l border-border ml-2">
        {steps.map((step: any, idx: number) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_#ED3F27]" />
            <div className="flex items-baseline gap-2">
              <span className="text-md font-black text-primary font-display">{step.num || `0${idx + 1}`}</span>
              <h4 className="text-sm font-black uppercase text-foreground font-display">{step.title || 'Step Title'}</h4>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono mt-0.5">{step.tagline || 'Tagline'}</p>
            <p className="text-muted-text text-xs leading-relaxed mt-1 font-body">{step.desc || 'Describe this process step.'}</p>
          </div>
        ))}
        {steps.length === 0 && (
          <p className="text-muted-text/50 text-xs italic text-center py-4 font-mono">No methodology steps configured.</p>
        )}
      </div>
    </div>
  )
}

function AboutPreview({ values }: { values: any[] }) {
  return (
    <div className="bg-bg-base border border-border-theme p-6 rounded-2xl space-y-6 text-left shadow-2xl">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">Core Philosophy</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-foreground font-display">What Stokes Us.</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {values.map((val: any, idx: number) => {
          const Icon = iconMap[val.iconName] || HelpCircle
          return (
            <div key={idx} className="bg-surface-base border border-border-theme rounded-xl p-5 flex flex-col justify-between">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-tight mb-1 font-display">{val.title || 'Philosophy Title'}</h4>
                <p className="text-white/50 text-xs leading-relaxed font-body">{val.desc || 'Describe this value.'}</p>
              </div>
            </div>
          )
        })}
        {values.length === 0 && (
          <p className="text-muted-text/50 text-xs italic text-center py-4 font-mono">No philosophy values configured.</p>
        )}
      </div>
    </div>
  )
}

function PricingPreview({ packages }: { packages: any[] }) {
  return (
    <div className="bg-bg-base border border-border-theme p-6 rounded-2xl space-y-6 text-left shadow-2xl">
      <div className="flex flex-col items-center text-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">Partnerships</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-foreground font-display">Select Your Fuel Rate</h3>
      </div>
      <div className="space-y-4">
        {packages.map((pkg: any, idx: number) => (
          <div key={idx} className={`relative bg-surface-base border rounded-xl p-5 flex flex-col gap-4 ${
            pkg.popular ? "border-[#ED3F27]/50" : "border-border-theme"
          }`}>
            {pkg.popular && (
              <span className="absolute -top-2.5 right-4 bg-primary text-foreground text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-mono">
                Popular
              </span>
            )}
            <div>
              <h4 className="text-sm font-black text-foreground uppercase tracking-tight font-display">{pkg.name || 'Package Name'}</h4>
              <p className="text-muted-text text-[10px] mt-1 font-body">{pkg.desc || 'Description'}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-foreground">{pkg.price || '$0'}</span>
              <span className="text-[9px] text-muted-text font-bold uppercase tracking-wider font-mono">{pkg.term || 'term'}</span>
            </div>
            <ul className="space-y-1.5 border-t border-border-theme pt-3">
              {(pkg.features || []).slice(0, 3).map((f: string, fIdx: number) => (
                <li key={fIdx} className="text-[10px] text-muted-text flex items-center gap-1.5 font-body">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
              {(pkg.features || []).length > 3 && (
                <li className="text-[9px] text-muted-text/50 italic font-body">+{pkg.features.length - 3} more deliverables</li>
              )}
            </ul>
          </div>
        ))}
        {packages.length === 0 && (
          <p className="text-muted-text/50 text-xs italic text-center py-4 font-mono">No pricing packages configured.</p>
        )}
      </div>
    </div>
  )
}

export default function SettingsAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'general' | 'why' | 'process' | 'about' | 'pricing'>('general')

  // Settings State Form
  const [siteName, setSiteName] = useState('Flamnow')
  const [contactEmail, setContactEmail] = useState('hello@flamnow.com')
  const [contactPhone, setContactPhone] = useState('+1 (555) 019-2831')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [enableCursor, setEnableCursor] = useState(true)
  const [instagram, setInstagram] = useState('#')
  const [linkedin, setLinkedin] = useState('#')
  const [twitter, setTwitter] = useState('#')

  // New Settings State Form Arrays
  const [valueProps, setValueProps] = useState<any[]>([])
  const [processSteps, setProcessSteps] = useState<any[]>([])
  const [aboutValues, setAboutValues] = useState<any[]>([])
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
      
      if (error) throw error
      
      const configList = data || []

      // Map values
      configList.forEach(item => {
        if (item.key === 'general_settings') {
          setSiteName(item.value.siteName || 'Flamnow')
          setContactEmail(item.value.contactEmail || '')
          setContactPhone(item.value.contactPhone || '')
        } else if (item.key === 'feature_flags') {
          setMaintenanceMode(!!item.value.maintenanceMode)
          setEnableCursor(item.value.enableCursor !== false)
        } else if (item.key === 'social_links') {
          setInstagram(item.value.instagram || '#')
          setLinkedin(item.value.linkedin || '#')
          setTwitter(item.value.twitter || '#')
        } else if (item.key === 'why_flamnow_value_props') {
          setValueProps(item.value || [])
        } else if (item.key === 'process_steps') {
          setProcessSteps(item.value || [])
        } else if (item.key === 'about_values') {
          setAboutValues(item.value || [])
        } else if (item.key === 'pricing_packages') {
          setPricingPackages(item.value || [])
        }
      })

    } catch (err) {
      console.error('Error fetching settings:', err)
      setErrorMsg('Failed to sync site parameters from Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Website Name
    if (!siteName.trim()) {
      errors.siteName = 'Website name is required.'
    } else if (siteName.length > 30) {
      errors.siteName = 'Website name must be 30 characters or less.'
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required.'
    } else if (!emailPattern.test(contactEmail)) {
      errors.contactEmail = 'Please provide a valid email address.'
    }

    // Phone
    if (!contactPhone.trim()) {
      errors.contactPhone = 'Contact phone/hotline is required.'
    }

    // Social URLs
    const urlPattern = /^(\/|#|https?:\/\/)/
    if (instagram && instagram !== '#' && !urlPattern.test(instagram)) {
      errors.instagram = 'Instagram link must be a valid URL starting with http/https or #.'
    }
    if (linkedin && linkedin !== '#' && !urlPattern.test(linkedin)) {
      errors.linkedin = 'LinkedIn link must be a valid URL starting with http/https or #.'
    }
    if (twitter && twitter !== '#' && !urlPattern.test(twitter)) {
      errors.twitter = 'Twitter link must be a valid URL starting with http/https or #.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please resolve validation errors before saving.')
      return
    }

    setActionLoading(true)

    const payloadGeneral = {
      key: 'general_settings',
      value: { siteName, contactEmail, contactPhone },
      description: 'Main corporate identity parameters'
    }

    const payloadFeatures = {
      key: 'feature_flags',
      value: { maintenanceMode, enableCursor },
      description: 'System functional toggles'
    }

    const payloadSocials = {
      key: 'social_links',
      value: { instagram, linkedin, twitter },
      description: 'Social networking accounts references'
    }

    const payloadWhyProps = {
      key: 'why_flamnow_value_props',
      value: valueProps,
      description: 'Why Flamnow section value propositions'
    }

    const payloadProcess = {
      key: 'process_steps',
      value: processSteps,
      description: 'Methodology process steps'
    }

    const payloadAbout = {
      key: 'about_values',
      value: aboutValues,
      description: 'About page core philosophy values'
    }

    const payloadPricing = {
      key: 'pricing_packages',
      value: pricingPackages,
      description: 'Pricing packages details'
    }

    try {
      // Upsert all settings keys in parallel
      const { error: err1 } = await supabase.from('site_settings').upsert(payloadGeneral)
      const { error: err2 } = await supabase.from('site_settings').upsert(payloadFeatures)
      const { error: err3 } = await supabase.from('site_settings').upsert(payloadSocials)
      const { error: err4 } = await supabase.from('site_settings').upsert(payloadWhyProps)
      const { error: err5 } = await supabase.from('site_settings').upsert(payloadProcess)
      const { error: err6 } = await supabase.from('site_settings').upsert(payloadAbout)
      const { error: err7 } = await supabase.from('site_settings').upsert(payloadPricing)

      if (err1 || err2 || err3 || err4 || err5 || err6 || err7) {
        throw err1 || err2 || err3 || err4 || err5 || err6 || err7
      }

      setSuccessMsg('Parameters updated successfully in site_settings database.')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings')
    } finally {
      setActionLoading(false)
    }
  }

  // Array Mutation Handlers
  const addValueProp = () => {
    setValueProps([...valueProps, { num: `0${valueProps.length + 1}`, title: '', desc: '', iconName: 'Flame' }])
  }
  const removeValueProp = (idx: number) => {
    setValueProps(valueProps.filter((_, i) => i !== idx))
  }
  const updateValueProp = (idx: number, field: string, val: any) => {
    const updated = [...valueProps]
    updated[idx] = { ...updated[idx], [field]: val }
    setValueProps(updated)
  }

  const addProcessStep = () => {
    setProcessSteps([...processSteps, { num: `0${processSteps.length + 1}`, title: '', tagline: '', desc: '' }])
  }
  const removeProcessStep = (idx: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== idx))
  }
  const updateProcessStep = (idx: number, field: string, val: any) => {
    const updated = [...processSteps]
    updated[idx] = { ...updated[idx], [field]: val }
    setProcessSteps(updated)
  }

  const addAboutValue = () => {
    setAboutValues([...aboutValues, { title: '', desc: '', iconName: 'Compass' }])
  }
  const removeAboutValue = (idx: number) => {
    setAboutValues(aboutValues.filter((_, i) => i !== idx))
  }
  const updateAboutValue = (idx: number, field: string, val: any) => {
    const updated = [...aboutValues]
    updated[idx] = { ...updated[idx], [field]: val }
    setAboutValues(updated)
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
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <Settings className="h-4 w-4 text-[#FF9F0A]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">System Parameters</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            HQ Console Settings
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Configure metadata, features flags, and custom pages content sections.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF9F0A] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving configurations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Console Columns */}
          <div className="lg:col-span-12 flex flex-col md:flex-row gap-8">
            
            {/* Left Hand Navigation Tabs */}
            <div className="w-full md:w-56 shrink-0 flex flex-col gap-1.5 border border-border-theme bg-surface-base/40 p-2 rounded-2xl">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-text/30 px-3.5 py-1.5 font-mono">Console Sections</span>
              
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                  activeTab === 'general' ? 'bg-foreground/10 text-foreground border border-border' : 'text-muted-text hover:text-foreground/80'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Identity & Flags</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('why')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                  activeTab === 'why' ? 'bg-foreground/10 text-foreground border border-border' : 'text-muted-text hover:text-foreground/80'
                }`}
              >
                <Flame className="h-4 w-4" />
                <span>Why Flamnow</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('process')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                  activeTab === 'process' ? 'bg-foreground/10 text-foreground border border-border' : 'text-muted-text hover:text-foreground/80'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Methodology</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                  activeTab === 'about' ? 'bg-foreground/10 text-foreground border border-border' : 'text-muted-text hover:text-foreground/80'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>About Values</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                  activeTab === 'pricing' ? 'bg-foreground/10 text-foreground border border-border' : 'text-muted-text hover:text-foreground/80'
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>Pricing Rates</span>
              </button>
            </div>

            {/* Form Column (5cols) & Preview Column (5cols) */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
              
              {/* Form Panel */}
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

                {/* Tab: General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    {/* General Settings Section */}
                    <div className="bg-surface-base border border-border-theme p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-border-theme">
                        <Globe className="h-4 w-4 text-[#FF9F0A]" />
                        <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                          Corporate Identity
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                            Website Name / Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Flamnow"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#FF9F0A]/50 transition-all font-mono"
                          />
                          {validationErrors.siteName && (
                            <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.siteName}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                            Corporate Contact Email
                          </label>
                          <input
                            type="email"
                            placeholder="hello@flamnow.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#FF9F0A]/50 transition-all font-mono"
                          />
                          {validationErrors.contactEmail && (
                            <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.contactEmail}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                          Corporate Contact Hotline
                        </label>
                        <input
                          type="text"
                          placeholder="+1 (555) 012-3456"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#FF9F0A]/50 transition-all font-mono"
                        />
                        {validationErrors.contactPhone && (
                          <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.contactPhone}</p>
                        )}
                      </div>
                    </div>

                    {/* Feature Flags Section */}
                    <div className="bg-surface-base border border-border-theme p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-border-theme">
                        <Sliders className="h-4 w-4 text-[#00E5FF]" />
                        <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                          Console Feature Switches
                        </h3>
                      </div>

                      <div 
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border-theme bg-foreground/[0.005] cursor-pointer hover:bg-foreground/[0.01]"
                        onClick={() => setEnableCursor(!enableCursor)}
                      >
                        <div>
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Interactive Custom Cursor</h4>
                          <p className="text-[10px] text-muted-text mt-0.5">Use custom aesthetic mouse tracking bubble on public web</p>
                        </div>
                        <div className="text-foreground/85" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={enableCursor}
                            onChange={(e) => setEnableCursor(e.target.checked)}
                            className="h-4.5 w-4.5 accent-primary cursor-pointer"
                          />
                        </div>
                      </div>

                      <div 
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border-theme bg-foreground/[0.005] cursor-pointer hover:bg-foreground/[0.01]"
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                      >
                        <div>
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Maintenance Mode</h4>
                          <p className="text-[10px] text-muted-text mt-0.5">Redirect public visitors to static offline gate</p>
                        </div>
                        <div className="text-foreground/85" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={maintenanceMode}
                            onChange={(e) => setMaintenanceMode(e.target.checked)}
                            className="h-4.5 w-4.5 accent-primary cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="bg-surface-base border border-border-theme p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-border-theme">
                        <Globe className="h-4 w-4 text-[#BF5AF2]" />
                        <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                          Social Accounts
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                            Instagram URL
                          </label>
                          <input
                            type="text"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none font-mono"
                          />
                          {validationErrors.instagram && (
                            <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.instagram}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                            LinkedIn URL
                          </label>
                          <input
                            type="text"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none font-mono"
                          />
                          {validationErrors.linkedin && (
                            <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.linkedin}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                            Twitter / X URL
                          </label>
                          <input
                            type="text"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none font-mono"
                          />
                          {validationErrors.twitter && (
                            <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.twitter}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Why Flamnow Props */}
                {activeTab === 'why' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-surface-base border border-border-theme p-4 rounded-xl">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Props List ({valueProps.length})</span>
                      <button
                        type="button"
                        onClick={addValueProp}
                        className="flex items-center gap-1.5 border border-primary/30 bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Prop</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {valueProps.map((prop, idx) => (
                        <div key={idx} className="bg-surface-base border border-border-theme p-5 rounded-2xl space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeValueProp(idx)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg border border-border-theme bg-surface-base hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Num</label>
                              <input
                                type="text"
                                value={prop.num}
                                onChange={(e) => updateValueProp(idx, 'num', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Icon Component</label>
                              <select
                                value={prop.iconName}
                                onChange={(e) => updateValueProp(idx, 'iconName', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              >
                                <option value="Flame">Flame (Value 1)</option>
                                <option value="Rocket">Rocket (Value 2)</option>
                                <option value="BarChart3">BarChart3 (Value 3)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Prop Title</label>
                            <input
                              type="text"
                              value={prop.title}
                              onChange={(e) => updateValueProp(idx, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Description</label>
                            <textarea
                              value={prop.desc}
                              onChange={(e) => updateValueProp(idx, 'desc', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono min-h-[60px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Process Steps */}
                {activeTab === 'process' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-surface-base border border-border-theme p-4 rounded-xl">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Steps List ({processSteps.length})</span>
                      <button
                        type="button"
                        onClick={addProcessStep}
                        className="flex items-center gap-1.5 border border-primary/30 bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Step</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {processSteps.map((step, idx) => (
                        <div key={idx} className="bg-surface-base border border-border-theme p-5 rounded-2xl space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeProcessStep(idx)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg border border-border-theme bg-surface-base hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Num</label>
                              <input
                                type="text"
                                value={step.num}
                                onChange={(e) => updateProcessStep(idx, 'num', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                            <div className="col-span-2 space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Tagline / Sub</label>
                              <input
                                type="text"
                                value={step.tagline}
                                onChange={(e) => updateProcessStep(idx, 'tagline', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Step Title</label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Description</label>
                            <textarea
                              value={step.desc}
                              onChange={(e) => updateProcessStep(idx, 'desc', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono min-h-[60px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: About Values */}
                {activeTab === 'about' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-surface-base border border-border-theme p-4 rounded-xl">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Philosophy List ({aboutValues.length})</span>
                      <button
                        type="button"
                        onClick={addAboutValue}
                        className="flex items-center gap-1.5 border border-primary/30 bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Value</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {aboutValues.map((val, idx) => (
                        <div key={idx} className="bg-surface-base border border-border-theme p-5 rounded-2xl space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeAboutValue(idx)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg border border-border-theme bg-surface-base hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Icon Component</label>
                            <select
                              value={val.iconName}
                              onChange={(e) => updateAboutValue(idx, 'iconName', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                            >
                              <option value="Compass">Compass (Philosophy 1)</option>
                              <option value="Zap">Zap (Philosophy 2)</option>
                              <option value="HeartHandshake">HeartHandshake (Philosophy 3)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Value Title</label>
                            <input
                              type="text"
                              value={val.title}
                              onChange={(e) => updateAboutValue(idx, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Description</label>
                            <textarea
                              value={val.desc}
                              onChange={(e) => updateAboutValue(idx, 'desc', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono min-h-[60px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Pricing Packages */}
                {activeTab === 'pricing' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-surface-base border border-border-theme p-4 rounded-xl">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Packages ({pricingPackages.length})</span>
                      <button
                        type="button"
                        onClick={addPricingPackage}
                        className="flex items-center gap-1.5 border border-primary/30 bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Rate</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {pricingPackages.map((pkg, idx) => (
                        <div key={idx} className="bg-surface-base border border-border-theme p-5 rounded-2xl space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removePricingPackage(idx)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg border border-border-theme bg-surface-base hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Name</label>
                              <input
                                type="text"
                                value={pkg.name}
                                onChange={(e) => updatePricingPackage(idx, 'name', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Price</label>
                              <input
                                type="text"
                                value={pkg.price}
                                onChange={(e) => updatePricingPackage(idx, 'price', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Term Scope</label>
                              <input
                                type="text"
                                value={pkg.term}
                                onChange={(e) => updatePricingPackage(idx, 'term', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">CTA Button</label>
                              <input
                                type="text"
                                value={pkg.cta}
                                onChange={(e) => updatePricingPackage(idx, 'cta', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-lg bg-bg-base border border-border-theme">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">Show Popular Tag</span>
                            <input
                              type="checkbox"
                              checked={!!pkg.popular}
                              onChange={(e) => updatePricingPackage(idx, 'popular', e.target.checked)}
                              className="h-4 w-4 accent-primary cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Short Description</label>
                            <input
                              type="text"
                              value={pkg.desc}
                              onChange={(e) => updatePricingPackage(idx, 'desc', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-text block font-mono">Deliverables (one per line)</label>
                            <textarea
                              value={(pkg.features || []).join('\n')}
                              onChange={(e) => updatePricingPackage(idx, 'features', e.target.value.split('\n'))}
                              className="w-full px-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground font-mono min-h-[90px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={fetchSettings}
                    className="flex items-center gap-2 border border-border bg-surface-base hover:bg-foreground/10 text-foreground px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-primary hover:opacity-95 text-foreground px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#FF9F0A]/10 font-sans"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save Parameters</span>
                  </button>
                </div>
              </form>

              {/* Previews Panel */}
              <div className="lg:sticky lg:top-8 space-y-6">
                <div className="border border-dashed border-border p-3 rounded-xl flex items-center justify-between bg-foreground/[0.005]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-text font-mono">Active Live Preview</span>
                  <span className="text-[9px] font-mono text-primary uppercase bg-primary/10 px-2 py-0.5 rounded font-black">Unsaved Changes Visible</span>
                </div>

                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <NavbarPreview siteName={siteName} />
                    <FooterPreview
                      siteName={siteName}
                      contactEmail={contactEmail}
                      contactPhone={contactPhone}
                      instagram={instagram}
                      linkedin={linkedin}
                      twitter={twitter}
                    />
                  </div>
                )}

                {activeTab === 'why' && (
                  <WhyFlamnowPreview valueProps={valueProps} />
                )}

                {activeTab === 'process' && (
                  <ProcessPreview steps={processSteps} />
                )}

                {activeTab === 'about' && (
                  <AboutPreview values={aboutValues} />
                )}

                {activeTab === 'pricing' && (
                  <PricingPreview packages={pricingPackages} />
                )}
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  )
}
