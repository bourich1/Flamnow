'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ResultsPreview from '@/components/admin/previews/ResultsPreview'
import { Save, Loader2, Check, AlertCircle, Plus, Edit2, Trash2, HelpCircle } from 'lucide-react'

interface ResultItem {
  id: string
  label: string
  displayVal: string
  rawVal: string
  prefix: string
  suffix: string
  iconName: 'Eye' | 'Users' | 'FolderKanban' | 'DollarSign'
  color: string
  detail: string
}

export default function ResultsAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [statsList, setStatsList] = useState<ResultItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form States
  const [formId, setFormId] = useState('')
  const [formLabel, setFormLabel] = useState('')
  const [formDisplayVal, setFormDisplayVal] = useState('')
  const [formRawVal, setFormRawVal] = useState('')
  const [formPrefix, setFormPrefix] = useState('')
  const [formSuffix, setFormSuffix] = useState('')
  const [formIconName, setFormIconName] = useState<'Eye' | 'Users' | 'FolderKanban' | 'DollarSign'>('Eye')
  const [formColor, setFormColor] = useState('#ED3F27')
  const [formDetail, setFormDetail] = useState('')

  useEffect(() => {
    fetchResultsData()
  }, [])

  async function fetchResultsData() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'results_stats')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data && data.value) {
        setStatsList(data.value || [])
      }
    } catch (err) {
      console.error('Error fetching results data:', err)
      setErrorMsg('Failed to sync results statistics from Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const selectStatForEdit = (stat: ResultItem) => {
    setEditingId(stat.id)
    setFormId(stat.id)
    setFormLabel(stat.label)
    setFormDisplayVal(stat.displayVal)
    setFormRawVal(stat.rawVal)
    setFormPrefix(stat.prefix || '')
    setFormSuffix(stat.suffix || '')
    setFormIconName(stat.iconName)
    setFormColor(stat.color)
    setFormDetail(stat.detail)
    setValidationErrors({})
    setShowForm(true)
  }

  const handleAddNew = () => {
    const nextId = `stat-${Date.now()}`
    setEditingId(null)
    setFormId(nextId)
    setFormLabel('New Statistic')
    setFormDisplayVal('100')
    setFormRawVal('100')
    setFormPrefix('')
    setFormSuffix('+')
    setFormIconName('Eye')
    setFormColor('#ED3F27')
    setFormDetail('Attributed value metrics outline.')
    setValidationErrors({})
    setShowForm(true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formLabel.trim()) errors.label = 'Label is required.'
    if (!formDisplayVal.trim()) errors.displayVal = 'Display Value is required (e.g. 12.8).'
    if (!formRawVal.trim() || isNaN(Number(formRawVal))) errors.rawVal = 'Raw numerical value is required.'
    if (!formDetail.trim()) errors.detail = 'Detail statement is required.'

    if (formLabel.length > 40) errors.label = 'Label must be less than 40 chars.'
    if (formDetail.length > 100) errors.detail = 'Detail must be less than 100 chars.'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return
    
    setActionLoading(true)
    const updatedList = statsList.filter(s => s.id !== id)
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'results_stats',
          value: updatedList,
          description: 'Attributed performance metrics counter data'
        })

      if (error) throw error
      
      setStatsList(updatedList)      
      setSuccessMsg(editingId ? 'Statistic updated successfully.' : 'New statistic created.')
      if (!editingId) setEditingId(formId)
      setShowForm(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting statistic')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please resolve validation errors.')
      return
    }

    setActionLoading(true)

    const payloadItem: ResultItem = {
      id: formId,
      label: formLabel,
      displayVal: formDisplayVal,
      rawVal: formRawVal,
      prefix: formPrefix,
      suffix: formSuffix,
      iconName: formIconName,
      color: formColor,
      detail: formDetail
    }

    let updatedList: ResultItem[] = []
    if (editingId) {
      updatedList = statsList.map(s => s.id === editingId ? payloadItem : s)
    } else {
      updatedList = [...statsList, payloadItem]
    }

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'results_stats',
          value: updatedList,
          description: 'Attributed performance metrics counter data'
        })

      if (error) throw error

      setStatsList(updatedList)
      setEditingId(formId)
      setSuccessMsg('Results statistics updated successfully in site_settings.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving statistics.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <Plus className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Attributed metrics</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            Results Statistics Editor
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Manage performance key numbers displayed in the Attributed Metrics section on the landing page.
          </p>
        </div>
        <div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-[#FF9F0A] hover:opacity-95 text-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#ED3F27]/10"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Stat</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving Statistics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List Selector + Form Editor (Left column) */}
          <div className={`space-y-6 ${showForm ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            
            {/* Horizontal Stats Selector */}
            <div className="flex flex-wrap gap-2.5">
              {statsList.map((stat) => (
                <button
                  key={stat.id}
                  onClick={() => selectStatForEdit(stat)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                    editingId === stat.id
                      ? 'border-[#ED3F27] bg-primary/10 text-foreground'
                      : 'border-border-theme bg-surface-base text-muted-text hover:text-foreground'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span>{stat.label}</span>
                </button>
              ))}
            </div>

            {/* Split Form Editor Card */}
            {showForm && (
            <form onSubmit={handleSave} className="bg-surface-base border border-border-theme p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border-theme pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                  {editingId ? 'Edit Selected Statistic' : 'Register New Metric'}
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
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Label */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                  Metric Title Label *
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                      onFocus={() => setFocusedField('formLabel')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none"
                  placeholder="e.g. Views Generated"
                />
                {validationErrors.label && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.label}</p>
                )}
              </div>

              {/* Values Group */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={formPrefix}
                      onFocus={() => setFocusedField('formPrefix')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormPrefix(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none font-mono"
                    placeholder="e.g. $"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Display Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDisplayVal}
                      onFocus={() => setFocusedField('formDisplayVal')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormDisplayVal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none font-mono"
                    placeholder="e.g. 12.8"
                  />
                  {validationErrors.displayVal && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.displayVal}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={formSuffix}
                      onFocus={() => setFocusedField('formSuffix')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormSuffix(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none font-mono"
                    placeholder="e.g. M+"
                  />
                </div>
              </div>

              {/* Raw Value */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                  Raw Numeric Value (For Count-Up Animation) *
                </label>
                <input
                  type="text"
                  required
                  value={formRawVal}
                      onFocus={() => setFocusedField('formRawVal')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormRawVal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none font-mono"
                  placeholder="e.g. 12800000"
                />
                {validationErrors.rawVal && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.rawVal}</p>
                )}
              </div>

              {/* Icon & Color Accents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Icon Theme Logo
                  </label>
                  <select
                    value={formIconName}
                    onChange={(e) => setFormIconName(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none font-mono"
                  >
                    <option value="Eye">Eye (Views/Radar)</option>
                    <option value="Users">Users (Followers/Audience)</option>
                    <option value="FolderKanban">FolderKanban (Campaigns/Work)</option>
                    <option value="DollarSign">DollarSign (Revenue/Attribution)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Color Accent Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formColor}
                      onFocus={() => setFocusedField('formColor')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="h-9 w-9 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formColor}
                      onFocus={() => setFocusedField('formColor')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Detail */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                  Attribution Brief Detail *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDetail}
                      onFocus={() => setFocusedField('formDetail')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormDetail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none resize-none font-sans"
                  placeholder="e.g. Sales spikes attributed directly to our campaign models."
                />
                {validationErrors.detail && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.detail}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-primary hover:opacity-95 text-foreground px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg font-sans disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Stat Card</span>
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
                Live Metric Card Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <ResultsPreview
              id={formId}
              label={formLabel}
              displayVal={formDisplayVal}
              rawVal={formRawVal}
              prefix={formPrefix}
              suffix={formSuffix}
              iconName={formIconName}
              color={formColor}
              detail={formDetail}
            focusedField={focusedField}
            />
          </div>
          )}
        </div>
      )}
    </div>
  )
}
