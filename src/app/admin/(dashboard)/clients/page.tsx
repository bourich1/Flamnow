'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ClientsPreview from '@/components/admin/previews/ClientsPreview'
import { 
  Handshake, 
  Plus, 
  Search, 
  Trash2, 
  Loader2, 
  Info,
  Check
} from 'lucide-react'

interface ClientItem {
  id: string
  name: string
  created_at: string
}

export default function ClientsAdminPage() {
  const supabase = createClient()
  const [clients, setClients] = useState<ClientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      setClients(data || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!newClientName.trim()) {
      errors.name = 'Brand name is required.'
    } else if (newClientName.trim().length > 60) {
      errors.name = 'Brand name must be 60 characters or less.'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please correct the validation errors.')
      return
    }

    setActionLoading(true)

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ name: newClientName.trim() }])
        .select()

      if (error) throw error
      
      if (data && data.length > 0) {
        setClients([...clients, data[0]].sort((a, b) => a.name.localeCompare(b.name)))
      }
      setNewClientName('')
      setSuccessMsg('Client brand registered successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error adding client brand')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this client partner?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      setClients(clients.filter(c => c.id !== id))
      setSuccessMsg('Client brand deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      alert(err.message || 'Error deleting client')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const clientNames = clients.map(c => c.name)

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <Handshake className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Partnerships</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            Client Logos & Brands
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Manage company/brand names that appear in the client marquee or case studies.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving clients list...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List Selector + Form Editor (Left column: 8cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Split Form Editor Card */}
            <div className="bg-surface-base border border-border-theme p-6 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4 pb-2 border-b border-border-theme">
                Register Brand Partner
              </h3>

              <form onSubmit={handleCreate} className="space-y-4">
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                    Brand Name *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corporation"
                      value={newClientName}
                      onFocus={() => setFocusedField('newClientName')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        setNewClientName(e.target.value)
                        setValidationErrors({})
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={actionLoading || !newClientName.trim()}
                      className="flex items-center gap-2 bg-primary hover:opacity-95 text-foreground px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-sans"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      <span>Register Partner</span>
                    </button>
                  </div>
                  {validationErrors.name && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.name}</p>
                  )}
                </div>
              </form>
            </div>

            {/* Brands Registry List */}
            <div className="bg-surface-base border border-border-theme p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-border-theme">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">
                  Partners Registry ({filteredClients.length} brands)
                </span>
                
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-text/50" />
                  <input
                    type="text"
                    placeholder="Search brand name..."
                    value={searchQuery}
                      onFocus={() => setFocusedField('searchQuery')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[10px] text-foreground placeholder-white/25 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
                  />
                </div>
              </div>

              {filteredClients.length === 0 ? (
                <div className="h-32 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-6 bg-foreground/[0.005]">
                  <Handshake className="h-6 w-6 text-muted-text/30 mb-2" />
                  <p className="text-xs text-muted-text">No client brands found matching query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredClients.map((client) => (
                    <div 
                      key={client.id}
                      className="bg-foreground/[0.01] border border-border-theme hover:border-border rounded-xl p-3 flex items-center justify-between group transition-all"
                    >
                      <span className="text-xs font-bold text-foreground/80 group-hover:text-foreground font-mono truncate">{client.name}</span>
                      
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-1 rounded bg-transparent text-muted-text/30 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Remove Partner"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Real-time Visual Marquee Preview (Right column: 4cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border-theme pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-text">
                Live Marquee Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <ClientsPreview clients={clientNames} focusedField={focusedField}
            />
          </div>

        </div>
      )}
    </div>
  )
}
