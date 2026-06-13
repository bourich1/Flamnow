'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TestimonialPreview from '@/components/admin/previews/TestimonialPreview'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  Loader2, 
  Info,
  Save
} from 'lucide-react'

interface TestimonialItem {
  id: string
  name: string
  role: string
  company: string
  quote: string
  metric: string
  metric_label: string
}

export default function TestimonialsAdminPage() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  // Form States (Global)
  const [formId, setFormId] = useState('')
  const [formName, setFormName] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formMetric, setFormMetric] = useState('')
  
  // Form States
  const [formRole, setFormRole] = useState('')
  const [formQuote, setFormQuote] = useState('')
  const [formMetricLabel, setFormMetricLabel] = useState('')

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('company', { ascending: true })
      
      if (error) throw error
      const tList = data || []
      setTestimonials(tList)
    } catch (err) {
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectTestimonial = (testimonial: TestimonialItem) => {
    setEditingId(testimonial.id)
    setFormId(testimonial.id)
    setFormName(testimonial.name)
    setFormCompany(testimonial.company)
    setFormMetric(testimonial.metric || '')
    
    setFormRole(testimonial.role || '')
    setFormQuote(testimonial.quote || '')
    setFormMetricLabel(testimonial.metric_label || '')

    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
    
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormId('')
    setFormName('Marcus Thorne')
    setFormCompany('Volt Audio')
    setFormMetric('+300%')
    
    setFormRole('VP of Global Marketing')
    setFormQuote('Explain how our custom strategic execution helped reshape identity.')
    setFormMetricLabel('Social Engagement Boost')

    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
    
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error
      const remaining = testimonials.filter(t => t.id !== id)
      setTestimonials(remaining)
      setSuccessMsg('Testimonial deleted successfully.')
      setShowForm(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      alert(err.message || 'Error deleting testimonial')
    } finally {
      setActionLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Required fields
    if (!formId.trim() && !editingId) errors.id = 'Testimonial Slug ID is required.'
    if (!formName.trim()) errors.name = 'Author name is required.'
    if (!formCompany.trim()) errors.company = 'Company is required.'
    if (!formRole.trim()) errors.role = 'role is required.'
    if (!formQuote.trim()) errors.quote = 'testimonial quote is required.'

    // Slug formatting
    if (!editingId && formId && !/^[a-z0-9-]+$/.test(formId)) {
      errors.id = 'Slug ID must be lowercase letters, numbers, and dashes only.'
    }

    // Character limits
    if (formName.length > 50) errors.name = 'Author name must be 50 characters or less.'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please correct validation errors. Note: fields are required.')
      
      return
    }

    setActionLoading(true)
    const finalId = editingId || formId.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    
    const payload = {
      id: finalId,
      name: formName,
      company: formCompany,
      metric: formMetric,
      role: formRole,
      quote: formQuote,
      metric_label: formMetricLabel,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
        setSuccessMsg('Testimonial updated successfully.')
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([payload])
        if (error) throw error
        setSuccessMsg('New testimonial created.')
        setEditingId(finalId)
        setShowForm(false)
      }

      // Refresh list
      fetchTestimonials()
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving testimonial record.')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <MessageSquare className="h-4 w-4 text-[#BF5AF2]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Client Advocacy</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            Testimonials Editor
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Manage client praise, endorsements, and growth metrics.
          </p>
        </div>

        <div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#BF5AF2] to-primary hover:opacity-95 text-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#BF5AF2]/10 font-sans animate-pulse"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Testimonial</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-[#BF5AF2] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving testimonials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List Selector + Form Editor (Left column) */}
          <div className={`space-y-6 ${showForm ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            
            {/* Horizontal Registry Selector */}
            <div className="bg-surface-base border border-border-theme p-4 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-theme pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">
                  Testimonials Registry ({testimonials.length} items)
                </span>
                
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-text/50" />
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchQuery}
                      onFocus={() => setFocusedField('searchQuery')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[11px] text-foreground focus:outline-none focus:border-[#BF5AF2]/40"
                  />
                </div>
              </div>

              {filteredTestimonials.length === 0 ? (
                <div className="h-32 border border-dashed border-border-theme rounded-xl flex flex-col items-center justify-center text-center p-6 bg-surface-base">
                  <p className="text-xs text-muted-text/50">No testimonials found matching query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredTestimonials.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => selectTestimonial(t)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                      editingId === t.id
                        ? 'border-[#BF5AF2] bg-[#BF5AF2]/5'
                        : 'border-border-theme bg-bg-base hover:bg-surface-base'
                    }`}
                  >
                    <div>
                      <span className="text-[8px] font-bold text-muted-text/50 uppercase tracking-widest block mb-1">{t.company}</span>
                      <h4 className="text-xs font-black uppercase text-foreground tracking-tight line-clamp-1">{t.name}</h4>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-border-theme">
                      <span className="text-[9px] font-mono text-[#BF5AF2]">{t.metric}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(t.id)
                        }}
                        className="text-muted-text/30 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>

            {/* Split Form Editor Card */}
            {showForm && (
            <form onSubmit={handleSubmit} className="bg-surface-base border border-border-theme p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border-theme pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#BF5AF2] font-bold">
                  {editingId ? 'Edit Selected Endorsement' : 'Register New Endorsement'}
                </h3>
                <div className="flex items-center gap-4">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="text-[10px] font-mono text-primary hover:underline"
                    >
                      + Create New Instead
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-[10px] font-mono text-white/50 hover:text-white"
                  >
                    Close [X]
                  </button>
                </div>
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

              <div className="space-y-5">
                {/* Role */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Author Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VP of Global Marketing"
                    value={formRole}
                        onFocus={() => setFocusedField('formRole')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 transition-all"
                  />
                  {validationErrors.role && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.role}</p>
                  )}
                </div>

                {/* Quote Statement */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Advocacy Quote *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Paste the testimonial quote statement..."
                    value={formQuote}
                        onFocus={() => setFocusedField('formQuote')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormQuote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 resize-none transition-all"
                  />
                  {validationErrors.quote && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.quote}</p>
                  )}
                </div>

                {/* Metric Label */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Metric Label </label>
                  <input
                    type="text"
                    placeholder="e.g. Social Engagement Boost"
                    value={formMetricLabel}
                        onFocus={() => setFocusedField('formMetricLabel')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormMetricLabel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 transition-all"
                  />
                </div>
              </div>

              {/* Global Settings */}
              <div className="pt-4 border-t border-white/10 dir-ltr text-left space-y-5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white/40">Global Settings</h4>
                
                {/* Slug ID & Author Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Testimonial Slug ID *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingId}
                      placeholder="e.g. marcus-thorne"
                      value={formId}
                        onFocus={() => setFocusedField('formId')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 transition-all font-mono disabled:opacity-40"
                    />
                    {validationErrors.id && (
                      <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.id}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Client Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Thorne"
                      value={formName}
                        onFocus={() => setFocusedField('formName')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 transition-all"
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.name}</p>
                    )}
                  </div>
                </div>

                {/* Company & Metric */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Volt Audio"
                      value={formCompany}
                        onFocus={() => setFocusedField('formCompany')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Growth Metric Value
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +300% or 250K+"
                      value={formMetric}
                        onFocus={() => setFocusedField('formMetric')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormMetric(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#BF5AF2]/50 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#BF5AF2] to-primary hover:opacity-95 text-foreground px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg font-sans disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Testimonial Record</span>
                </button>
              </div>

            </form>
            )}
          </div>

          {/* Right column: Preview */}
          {showForm && (
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-border-theme pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-text">
                Live Testimonial Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <div>
              <TestimonialPreview
                id={editingId || 't1'}
                name={formName}
                role={formRole || formRole}
                company={formCompany}
                quote={formQuote || formQuote}
                metric={formMetric}
                metric_label={formMetricLabel || formMetricLabel}
                focusedField={focusedField}
              />
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  )
}
