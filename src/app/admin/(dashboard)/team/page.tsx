'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TeamPreview from '@/components/admin/previews/TeamPreview'
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  Loader2, 
  Info,
  Save
} from 'lucide-react'

interface TeamMemberItem {
  id: string
  name: string
  role: string
  bio: string
  specialty: string
  instagram: string
  linkedin: string
}

export default function TeamAdminPage() {
  const supabase = createClient()
  const [team, setTeam] = useState<TeamMemberItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Form States
  const [formId, setFormId] = useState('')
  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formBio, setFormBio] = useState('')
  const [formSpecialty, setFormSpecialty] = useState('')
  const [formInstagram, setFormInstagram] = useState('#')
  const [formLinkedin, setFormLinkedin] = useState('#')

  useEffect(() => {
    fetchTeam()
  }, [])

  async function fetchTeam() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      const tmList = data || []
      setTeam(tmList)
      
      // Auto select first member
      if (tmList.length > 0) {
        selectMember(tmList[0])
      } else {
        handleAddNew()
      }
    } catch (err) {
      console.error('Error fetching team:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectMember = (member: TeamMemberItem) => {
    setEditingId(member.id)
    setFormId(member.id)
    setFormName(member.name)
    setFormRole(member.role)
    setFormBio(member.bio)
    setFormSpecialty(member.specialty)
    setFormInstagram(member.instagram)
    setFormLinkedin(member.linkedin)
    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormId('')
    setFormName('Creative Strategist')
    setFormRole('Growth Designer')
    setFormBio('Experienced in driving digital strategy and creative implementations.')
    setFormSpecialty('Growth Hacking & UI Design')
    setFormInstagram('#')
    setFormLinkedin('#')
    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) throw error
      const remaining = team.filter(t => t.id !== id)
      setTeam(remaining)
      setSuccessMsg('Team member deleted successfully.')
      if (remaining.length > 0) {
        selectMember(remaining[0])
      } else {
        handleAddNew()
      }
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      alert(err.message || 'Error deleting team member')
    } finally {
      setActionLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Required fields
    if (!formId.trim() && !editingId) errors.id = 'Member ID Slug is required.'
    if (!formName.trim()) errors.name = 'Full Name is required.'
    if (!formRole.trim()) errors.role = 'Role/Title is required.'
    if (!formSpecialty.trim()) errors.specialty = 'Specialty is required.'
    if (!formBio.trim()) errors.bio = 'Bio is required.'

    // Slug ID format
    if (!editingId && formId && !/^[a-z0-9-]+$/.test(formId)) {
      errors.id = 'ID must contain lowercase letters, numbers, and dashes only.'
    }

    // URL validations
    const urlPattern = /^(\/|#|https?:\/\/)/
    if (formInstagram && formInstagram !== '#' && !urlPattern.test(formInstagram)) {
      errors.instagram = 'Must start with http/https or be #.'
    }
    if (formLinkedin && formLinkedin !== '#' && !urlPattern.test(formLinkedin)) {
      errors.linkedin = 'Must start with http/https or be #.'
    }

    // Character limits
    if (formName.length > 50) errors.name = 'Name must be 50 characters or less.'
    if (formRole.length > 50) errors.role = 'Role must be 50 characters or less.'
    if (formSpecialty.length > 60) errors.specialty = 'Specialty must be 60 characters or less.'
    if (formBio.length > 300) errors.bio = 'Bio must be 300 characters or less.'

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
      name: formName,
      role: formRole,
      bio: formBio,
      specialty: formSpecialty,
      instagram: formInstagram || '#',
      linkedin: formLinkedin || '#'
    }

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setSuccessMsg('Team member updated successfully.')
      } else {
        // Insert
        const { error } = await supabase
          .from('team_members')
          .insert([payload])

        if (error) throw error
        setSuccessMsg('New team member registered successfully.')
        setEditingId(finalId)
      }

      // Refresh list
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .order('name', { ascending: true })
      setTeam(data || [])
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving team member parameters.')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredTeam = team.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Crew HQ</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            Team Members
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Manage the agency crew, bios, roles, and specialties showcased on the About page.
          </p>
        </div>

        <div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-[#FF9F0A] hover:opacity-95 text-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#ED3F27]/10 animate-pulse font-sans"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving team list...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List Selector + Form Editor (Left column: 8cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal Team Grid Selector */}
            <div className="bg-surface-base border border-border-theme p-4 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-theme pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">
                  Crew Registry ({team.length} members)
                </span>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-text/50" />
                  <input
                    type="text"
                    placeholder="Search crew..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[11px] text-foreground focus:outline-none focus:border-[#ED3F27]/40 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredTeam.map((member) => (
                  <div 
                    key={member.id}
                    onClick={() => selectMember(member)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                      editingId === member.id
                        ? 'border-[#ED3F27] bg-primary/5'
                        : 'border-border-theme bg-bg-base hover:bg-surface-base hover:border-border'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase text-foreground tracking-tight">{member.name}</h4>
                      <p className="text-[9px] font-mono text-primary uppercase mt-0.5">{member.role}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-border-theme">
                      <span className="text-[9px] font-mono text-muted-text">{member.specialty}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(member.id)
                        }}
                        className="text-muted-text/30 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Member"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Form Editor Card */}
            <form onSubmit={handleSubmit} className="bg-surface-base border border-border-theme p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border-theme pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                  {editingId ? 'Edit Selected Member Details' : 'Register New Crew Member'}
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="text-[10px] font-mono text-[#00E5FF] hover:underline"
                  >
                    + Add New Member
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
                    Member ID Slug *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    placeholder="e.g. alex-sterling"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono disabled:opacity-40"
                  />
                  {validationErrors.id && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.id}</p>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Sterling"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                  />
                  {validationErrors.name && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & Creative Director"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                  />
                  {validationErrors.role && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.role}</p>
                  )}
                </div>

                {/* Specialty */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand Design & CGI"
                    value={formSpecialty}
                    onChange={(e) => setFormSpecialty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                  />
                  {validationErrors.specialty && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.specialty}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                  Professional Bio *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe their background, focus, and core creative philosophy..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground focus:outline-none focus:border-[#ED3F27]/50 transition-all resize-none leading-relaxed"
                />
                {validationErrors.bio && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.bio}</p>
                )}
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/username or #"
                    value={formInstagram}
                    onChange={(e) => setFormInstagram(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
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
                    placeholder="https://linkedin.com/in/username or #"
                    value={formLinkedin}
                    onChange={(e) => setFormLinkedin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
                  />
                  {validationErrors.linkedin && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.linkedin}</p>
                  )}
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-primary hover:opacity-95 text-foreground px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 font-sans"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Visual Card Preview (Right column: 4cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border-theme pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-text">
                Live Card Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <TeamPreview
              id={editingId || 'm1'}
              name={formName}
              role={formRole}
              bio={formBio}
              specialty={formSpecialty}
              instagram={formInstagram}
              linkedin={formLinkedin}
            />
          </div>

        </div>
      )}
    </div>
  )
}

