'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ServiceCardPreview from '@/components/admin/previews/ServiceCardPreview'
import { 
  Layers, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  Loader2, 
  Sparkles,
  Info,
  Save,
  RotateCcw
} from 'lucide-react'

interface ServiceItem {
  id: string
  title: string
  tagline: string
  description: string
  features: string[]
  benefits: string[]
  metric_label: string | null
  metric_value: string | null
  color: string
}

export default function ServicesAdminPage() {
  const supabase = createClient()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Form States
  const [formId, setFormId] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formFeatures, setFormFeatures] = useState('')
  const [formBenefits, setFormBenefits] = useState('')
  const [formMetricLabel, setFormMetricLabel] = useState('')
  const [formMetricValue, setFormMetricValue] = useState('')
  const [formColor, setFormColor] = useState('#ED3F27')

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('title', { ascending: true })
      
      if (error) throw error
      const sList = data || []
      setServices(sList)
      
      // Auto select the first service for editing
      if (sList.length > 0) {
        selectService(sList[0])
      } else {
        handleAddNew()
      }
    } catch (err) {
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectService = (service: ServiceItem) => {
    setEditingId(service.id)
    setFormId(service.id)
    setFormTitle(service.title)
    setFormTagline(service.tagline)
    setFormDescription(service.description)
    setFormFeatures(service.features.join(', '))
    setFormBenefits(service.benefits.join(', '))
    setFormMetricLabel(service.metric_label || '')
    setFormMetricValue(service.metric_value || '')
    setFormColor(service.color)
    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormId('')
    setFormTitle('New Creative Service')
    setFormTagline('Explain the spark.')
    setFormDescription('Describe the custom strategy and high-fidelity output deliverables.')
    setFormFeatures('Aesthetic strategy, React implementation')
    setFormBenefits('Scale conversion velocity')
    setFormMetricLabel('Conversion Boost')
    setFormMetricValue('+120%')
    setFormColor('#ED3F27')
    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
      const remaining = services.filter(s => s.id !== id)
      setServices(remaining)
      setSuccessMsg('Service deleted successfully.')
      if (remaining.length > 0) {
        selectService(remaining[0])
      } else {
        handleAddNew()
      }
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      alert(err.message || 'Error deleting service')
    } finally {
      setActionLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Required fields
    if (!formId.trim() && !editingId) errors.id = 'Service URL Slug ID is required.'
    if (!formTitle.trim()) errors.title = 'Title is required.'
    if (!formTagline.trim()) errors.tagline = 'Tagline is required.'
    if (!formDescription.trim()) errors.description = 'Description is required.'
    
    // Slug ID format
    if (!editingId && formId && !/^[a-z0-9-]+$/.test(formId)) {
      errors.id = 'ID must contain lowercase letters, numbers, and dashes only (no spaces).'
    }

    // Color hex format
    if (formColor && !/^#[0-9A-Fa-f]{6}$/.test(formColor)) {
      errors.color = 'Must be a valid 6-character hex color (e.g. #ED3F27).'
    }

    // Character limits
    if (formTitle.length > 40) errors.title = 'Title must be 40 characters or less.'
    if (formTagline.length > 80) errors.tagline = 'Tagline must be 80 characters or less.'
    if (formDescription.length > 300) errors.description = 'Description must be 300 characters or less.'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please correct the validation errors below.')
      return
    }

    setActionLoading(true)

    const finalId = editingId || formId.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const payload = {
      id: finalId,
      title: formTitle,
      tagline: formTagline,
      description: formDescription,
      features: formFeatures.split(',').map(f => f.trim()).filter(Boolean),
      benefits: formBenefits.split(',').map(b => b.trim()).filter(Boolean),
      metric_label: formMetricLabel || null,
      metric_value: formMetricValue || null,
      color: formColor
    }

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setSuccessMsg('Service updated successfully.')
      } else {
        // Insert
        const { error } = await supabase
          .from('services')
          .insert([payload])

        if (error) throw error
        setSuccessMsg('New service registered successfully.')
        setEditingId(finalId)
      }

      // Refresh list
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('title', { ascending: true })
      setServices(data || [])
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving service parameters.')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Layers className="h-4 w-4 text-[#ED3F27]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Catalog Management</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            Services Management
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Create and edit agency offerings. Previews update in real-time before saving to Supabase.
          </p>
        </div>

        <div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#ED3F27] to-[#FF9F0A] hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#ED3F27]/10 animate-pulse"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Service</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#ED3F27] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving services records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List Selector + Form Editor (Left column: 8cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal Services Grid Selector */}
            <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">
                  Catalog Registry ({services.length} items)
                </span>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#ED3F27]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredServices.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => selectService(service)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                      editingId === service.id
                        ? 'border-[#ED3F27] bg-[#ED3F27]/5'
                        : 'border-white/5 bg-[#0b0b0b] hover:bg-[#121212] hover:border-white/10'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ backgroundColor: service.color }} />
                    
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-tight">{service.title}</h4>
                      <p className="text-[9px] font-mono text-white/30 uppercase mt-0.5">{service.id}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5">
                      <span className="text-[9px] font-mono" style={{ color: service.color }}>{service.metric_value || 'No metrics'}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(service.id)
                        }}
                        className="text-white/20 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Service"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Form Editor Card */}
            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#ED3F27] font-bold">
                  {editingId ? 'Edit Selected Service parameters' : 'Register New Offering'}
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="text-[10px] font-mono text-[#00E5FF] hover:underline"
                  >
                    + Switch to New Service
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-3 flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Service URL ID (slug) *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingId}
                      placeholder="e.g. video-production"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono disabled:opacity-40"
                    />
                  {validationErrors.id && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.id}</p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                      Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Video Production"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                  />
                  {validationErrors.title && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.title}</p>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Tagline / One-liner *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinematic narratives that hold attention."
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                />
                {validationErrors.tagline && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.tagline}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a detailed description of the service deliverables..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 transition-all resize-none"
                />
                {validationErrors.description && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.description}</p>
                )}
              </div>

              {/* Competencies Features (comma-separated) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Competencies Features (comma-separated list)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scriptwriting, 4K Filming, Color Grading"
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Performance Metric Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Average ROI"
                  value={formMetricLabel}
                  onChange={(e) => setFormMetricLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                />
                </div>

                <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Performance Metric Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4.8x or +220%"
                  value={formMetricValue}
                  onChange={(e) => setFormMetricValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none font-mono"
                />
                </div>
              </div>

              {/* Theme color accent */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Theme Accent Color Hex *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="h-10 w-10 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white font-mono focus:outline-none"
                  />
                </div>
                {validationErrors.color && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.color}</p>
                )}
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 pt-2">
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
                  <span>Save Service Record</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Visual Card Preview (Right column: 4cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                Live Card Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <ServiceCardPreview
              id={editingId || 'branding'}
              title={formTitle}
              tagline={formTagline}
              description={formDescription}
              features={formFeatures.split(',').map(f => f.trim()).filter(Boolean)}
              metric_label={formMetricLabel}
              metric_value={formMetricValue}
              color={formColor}
            />
          </div>

        </div>
      )}
    </div>
  )
}
