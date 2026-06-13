'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProjectCardPreview from '@/components/admin/previews/ProjectCardPreview'
import { 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  Loader2, 
  Info,
  Upload,
  Save,
} from 'lucide-react'
import { uploadFile } from '@/app/actions/storage'

interface ProjectItem {
  id: string
  client: string
  category: 'Branding' | 'Digital' | 'Campaigns' | 'Production'
  year: string
  tags: string[]
  color: string
  accent_color: string
  cover_image: string
  gallery?: { url: string; caption: string; aspect: string }[]
  title: string
  tagline: string
  description: string
  long_description: string
  challenge: string
  solution: string
  results: string[]
}

export default function ProjectsAdminPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  
  // Form States (Global)
  const [formId, setFormId] = useState('')
  const [formClient, setFormClient] = useState('')
  const [formCategory, setFormCategory] = useState<'Branding' | 'Digital' | 'Campaigns' | 'Production'>('Branding')
  const [formYear, setFormYear] = useState('')
  const [formTag, setFormTag] = useState('')
  const [formColor, setFormColor] = useState('#ED3F27')
  const [formAccentColor, setFormAccentColor] = useState('rgba(237, 63, 39, 0.1)')
  const [formCoverImage, setFormCoverImage] = useState('/volt_cover.png')
  const [formGallery, setFormGallery] = useState<{ url: string; caption: string; aspect: string }[]>([])
  
  // Form States (Content)
  const [formTitle, setFormTitle] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formLongDescription, setFormLongDescription] = useState('')
  const [formChallenge, setFormChallenge] = useState('')
  const [formSolution, setFormSolution] = useState('')
  const [formResult, setFormResult] = useState('')

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      const pList = data || []
      setProjects(pList)
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectProject = (project: ProjectItem) => {
    setEditingId(project.id)
    setFormId(project.id)
    setFormClient(project.client)
    setFormCategory(project.category)
    setFormYear(project.year)
    setFormTag(project.tags ? project.tags.join(', ') : '')
    setFormColor(project.color)
    setFormAccentColor(project.accent_color)
    setFormCoverImage(project.cover_image || '')
    setFormGallery(project.gallery || [])
    
    setFormTitle(project.title || '')
    setFormTagline('')
    setFormDescription('')
    setFormLongDescription('')
    setFormChallenge('')
    setFormSolution('')
    setFormResult(project.results?.join('\n') || '')

    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
    
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormId('')
    setFormClient('Nexus VR')
    setFormCategory('Branding')
    setFormYear(new Date().getFullYear().toString())
    setFormTag('')
    setFormColor('#ED3F27')
    setFormAccentColor('rgba(237, 63, 39, 0.1)')
    setFormCoverImage('/placeholder_cover.png')
    setFormGallery([])
    
    setFormTitle('Step into the Hyperreal')
    setFormTagline('A fluid design revolution')
    setFormDescription('Describe the custom strategy and layout details in a short pitch.')
    setFormLongDescription('Longer narrative detail outlining specs and processes.')
    setFormChallenge('Detail business problem')
    setFormSolution('Detail design execution')
    setFormResult('Outcome metric 1\nOutcome metric 2')

    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
    
    setShowForm(true)
  }

  const updateFormColor = (val: string) => {
    setFormColor(val)
    if (val.startsWith('#') && val.length === 7) {
      const r = parseInt(val.slice(1, 3), 16) || 237
      const g = parseInt(val.slice(3, 5), 16) || 63
      const b = parseInt(val.slice(5, 7), 16) || 39
      setFormAccentColor(`rgba(${r}, ${g}, ${b}, 0.1)`)
    }
  }

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    
    setUploadingCover(true)
    setErrorMsg('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'project-images')
      
      const result = await uploadFile(formData)
      if (result.error) {
        setErrorMsg(result.error)
      } else if (result.publicUrl) {
        setFormCoverImage(result.publicUrl)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleUploadGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    
    setUploadingGallery(true)
    setErrorMsg('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'project-images')
      
      const result = await uploadFile(formData)
      if (result.error) {
        setErrorMsg(result.error)
      } else if (result.publicUrl) {
        setFormGallery([...formGallery, { 
          url: result.publicUrl, 
          caption: 'NEW EXHIBIT', 
          aspect: 'h-[280px] md:col-span-1 md:h-[400px]' 
        }])
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading gallery image')
    } finally {
      setUploadingGallery(false)
    }
  }

  const updateGalleryItem = (index: number, key: string, value: string) => {
    const newGallery = [...formGallery]
    newGallery[index] = { ...newGallery[index], [key]: value }
    setFormGallery(newGallery)
  }

  const removeGalleryItem = (index: number) => {
    setFormGallery(formGallery.filter((_, i) => i !== index))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      const remaining = projects.filter(p => p.id !== id)
      setProjects(remaining)
      setSuccessMsg('Project deleted successfully.')
      setShowForm(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      alert(err.message || 'Error deleting project')
    } finally {
      setActionLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Required fields
    if (!formId.trim() && !editingId) errors.id = 'Project Slug ID is required.'
    if (!formClient.trim()) errors.client = 'Client is required.'
    if (!formTitle.trim()) errors.title = 'Title is required.'
    if (!formTagline.trim()) errors.tagline = 'Tagline is required.'
    if (!formDescription.trim()) errors.description = 'Description is required.'
    if (!formYear.trim() || isNaN(Number(formYear))) errors.year = 'A valid numeric year is required.'

    // Slug formatting
    if (!editingId && formId && !/^[a-z0-9-]+$/.test(formId)) {
      errors.id = 'Slug ID must be lowercase letters, numbers, and dashes only.'
    }

    // Colors validation
    if (formColor && !/^#[0-9A-Fa-f]{6}$/.test(formColor)) {
      errors.color = 'Must be a valid hex color (e.g. #ED3F27).'
    }

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
      client: formClient,
      category: formCategory,
      year: formYear,
      tags: formTag.split(',').map(t => t.trim()).filter(Boolean),
      color: formColor,
      accent_color: formAccentColor,
      cover_image: formCoverImage,
      gallery: formGallery,
      title: formTitle,
      tagline: formTagline,
      description: formDescription,
      long_description: formLongDescription,
      challenge: formChallenge,
      solution: formSolution,
      results: formResult.split('\n').map(r => r.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
        setSuccessMsg('Project case study updated.')
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([payload])
        if (error) throw error
        setSuccessMsg('Case study registered successfully.')
        setEditingId(finalId)
        setShowForm(false)
      }

      // Refresh list
      fetchProjects()
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving project.')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredProjects = projects.filter(p => {
    const title = p.title || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Briefcase className="h-4 w-4 text-[#00E5FF]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Case Studies</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            Projects Portfolio
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Create, update, and manage case study narratives.
          </p>
        </div>

        <div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#BF5AF2] hover:opacity-95 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#00E5FF]/10 animate-pulse font-sans"
          >
            <Plus className="h-3.5 w-3.5 animate-bounce" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#00E5FF] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving portfolio records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Registry Selector + Form Editor */}
          <div className={`space-y-6 ${showForm ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            
            {/* Horizontal Projects Registry Selector */}
            <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                <div className="flex flex-wrap gap-1.5 border border-white/5 bg-[#0b0b0b] p-1 rounded-xl">
                  {['All', 'Branding', 'Digital', 'Campaigns', 'Production'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                      onFocus={() => setFocusedField('searchQuery')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-white/5 bg-[#0b0b0b] text-[11px] text-white focus:outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/40 transition-all"
                  />
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="h-32 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-[#0b0b0b]">
                  <p className="text-xs text-white/30">No case studies found matching query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProjects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => selectProject(project)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                      editingId === project.id
                        ? 'border-[#00E5FF] bg-[#00E5FF]/5'
                        : 'border-white/5 bg-[#0b0b0b] hover:bg-[#121212]'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ backgroundColor: project.color }} />
                    <div>
                      <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-1">{project.client} ({project.year})</span>
                      <h4 className="text-xs font-black uppercase text-white tracking-tight line-clamp-1">{project.title}</h4>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5">
                      <span className="text-[8px] font-mono uppercase bg-[#121212] text-white/60 px-2 py-0.5 rounded">{project.category}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(project.id)
                        }}
                        className="text-white/20 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Case Study"
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
            <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                  {editingId ? 'Edit Selected Project' : 'Register New Case Study'}
                </h3>
                <div className="flex items-center gap-4">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="text-[10px] font-mono text-[#ED3F27] hover:underline"
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
                {/* Title Header */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Case Study Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rewriting the Sound of Electric Power"
                    value={formTitle}
                        onFocus={() => setFocusedField('formTitle')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 transition-all"
                  />
                  {validationErrors.title && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.title}</p>
                  )}
                </div>

                {/* Tagline hook */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Tagline / Intro Hook *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A sonic branding revolution for premium EV."
                    value={formTagline}
                        onFocus={() => setFocusedField('formTagline')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 transition-all"
                  />
                  {validationErrors.tagline && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.tagline}</p>
                  )}
                </div>

                {/* Short Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Short Description (Card view summary) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Summarize the project brief for public grids..."
                    value={formDescription}
                        onFocus={() => setFocusedField('formDescription')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 resize-none transition-all"
                  />
                  {validationErrors.description && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.description}</p>
                  )}
                </div>

                {/* Long Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Long Narrative Description </label>
                  <textarea
                    rows={4}
                    placeholder="Detailed case study explanation context..."
                    value={formLongDescription}
                        onFocus={() => setFocusedField('formLongDescription')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormLongDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 resize-none transition-all"
                  />
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      The Challenge </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly state client pain points..."
                      value={formChallenge}
                        onFocus={() => setFocusedField('formChallenge')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormChallenge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 resize-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Our Solution </label>
                    <textarea
                      rows={3}
                      placeholder="Detail our agency strategic execution..."
                      value={formSolution}
                        onFocus={() => setFocusedField('formSolution')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormSolution(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 resize-none transition-all"
                    />
                  </div>
                </div>

                {/* Key Outcomes */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Key Outcomes (One per line) </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. +300% increase in social media engagement&#10;Acquired 3 major EV integration partnerships"
                    value={formResult}
                        onFocus={() => setFocusedField('formResults')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormResult(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 resize-none font-mono transition-all"
                  />
                </div>
              </div>

              {/* Global Settings */}
              <div className="pt-4 border-t border-white/10 dir-ltr text-left space-y-5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white/40">Global Settings</h4>
                
                {/* Slug ID & Client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Project Slug ID *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingId}
                      placeholder="e.g. volt-audio"
                      value={formId}
                        onFocus={() => setFocusedField('formId')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/40 transition-all font-mono disabled:opacity-40"
                    />
                    {validationErrors.id && (
                      <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.id}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Volt Audio"
                      value={formClient}
                        onFocus={() => setFocusedField('formClient')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormClient(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/40 transition-all"
                    />
                    {validationErrors.client && (
                      <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.client}</p>
                    )}
                  </div>
                </div>

                {/* Category & Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 font-mono transition-all"
                    >
                      <option value="Branding">Branding</option>
                      <option value="Digital">Digital</option>
                      <option value="Campaigns">Campaigns</option>
                      <option value="Production">Production</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Launch Year *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026"
                      value={formYear}
                        onFocus={() => setFocusedField('formYear')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 font-mono transition-all"
                    />
                    {validationErrors.year && (
                      <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.year}</p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Tags / Focus Specialties (comma-separated list)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brand Identity, Visual Design, React WebGL"
                    value={formTag}
                        onFocus={() => setFocusedField('formTags')}
                        onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 transition-all"
                  />
                </div>

                {/* Cover Image Upload/Path */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Cover Mockup Image Path or URL *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="/volt_cover.png"
                      value={formCoverImage}
                        onFocus={() => setFocusedField('formCoverImage')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormCoverImage(e.target.value)}
                      className="flex-grow px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 font-mono transition-all"
                    />
                    <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-white/20 bg-surface-base hover:bg-white/[0.08] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${uploadingCover ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploadingCover ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00E5FF]" />
                      ) : (
                        <Upload className="h-3.5 w-3.5 text-muted-text" />
                      )}
                      <span>{uploadingCover ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCover}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Gallery Image Uploads */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Gallery & Exhibits (Optional)
                    </label>
                    <label className={`flex items-center gap-2 px-3 py-1.5 rounded border border-border hover:border-white/20 bg-surface-base hover:bg-white/[0.08] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${uploadingGallery ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploadingGallery ? (
                        <Loader2 className="h-3 w-3 animate-spin text-[#00E5FF]" />
                      ) : (
                        <Upload className="h-3 w-3 text-[#00E5FF]" />
                      )}
                      <span>{uploadingGallery ? 'Uploading...' : 'Add Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadGalleryImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {formGallery.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 border border-white/5 bg-[#0b0b0b] rounded-xl items-start sm:items-center relative">
                        <div className="h-16 w-24 shrink-0 bg-white/5 rounded-lg overflow-hidden border border-white/10 relative">
                          <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                          <input
                            type="text"
                            value={item.caption}
                        onFocus={() => setFocusedField('item.caption')}
                        onBlur={() => setFocusedField(null)}
                            onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)}
                            placeholder="CAPTION TEXT"
                            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-transparent text-[11px] text-white focus:border-[#00E5FF]/40 font-mono uppercase"
                          />
                          <select
                            value={item.aspect}
                            onChange={(e) => updateGalleryItem(index, 'aspect', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#121212] text-[11px] text-white focus:border-[#00E5FF]/40 font-mono"
                          >
                            <option value="h-[280px] md:col-span-1 md:h-[400px]">Standard (1 Col)</option>
                            <option value="h-[280px] md:col-span-2 md:h-[400px]">Wide (2 Col)</option>
                            <option value="h-[300px] md:col-span-3 md:h-[500px]">Full Width (3 Col)</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(index)}
                          className="text-white/20 hover:text-red-400 absolute top-2 right-2 sm:static p-1 bg-black/40 rounded sm:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {formGallery.length === 0 && (
                      <div className="text-center p-6 border border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] uppercase font-mono text-white/30">No gallery images uploaded yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color accents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Theme Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formColor}
                        onFocus={() => setFocusedField('formColor')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => updateFormColor(e.target.value)}
                        className="h-10 w-10 bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formColor}
                        onFocus={() => setFocusedField('formColor')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => updateFormColor(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 transition-all"
                      />
                    </div>
                    {validationErrors.color && (
                      <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.color}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                      Glow Accent Overlay Color
                    </label>
                    <input
                      type="text"
                      value={formAccentColor}
                        onFocus={() => setFocusedField('formAccentColor')}
                        onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/40 font-mono transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-[#00E5FF] hover:opacity-95 text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg font-sans disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Project Record</span>
                </button>
              </div>

            </form>
            )}
          </div>

          {/* Right column: Real-time Preview */}
          {showForm && (
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-border-theme pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-text">
                Live Case Card Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <div>
              <ProjectCardPreview
                id={editingId || 'volt-audio'}
                title={formTitle || formTitle}
                client={formClient}
                category={formCategory}
                year={formYear}
                tagline={formTagline || formTagline}
                description={formDescription || formDescription}
                color={formColor}
                accent_color={formAccentColor}
                cover_image={formCoverImage}
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
