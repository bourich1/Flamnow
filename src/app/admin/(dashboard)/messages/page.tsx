'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  Search, 
  Trash2, 
  X, 
  Loader2, 
  Database, 
  Info,
  Clock,
  User,
  Building2,
  DollarSign,
  Sparkles,
  ChevronDown,
  Check,
  Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageItem {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  company: string | null
  services: string[] | null
  budget: string | null
  message: string
  status?: 'new' | 'read' | 'replied' | 'archived'
}



export default function MessagesAdminPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Message Selection
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null)
  
  // Status Selector UI State
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map status from database if it exists, otherwise default to 'new'
      const mapped = (data || []).map((msg: any) => {
        return {
          ...msg,
          status: msg.status || 'new'
        }
      })

      setMessages(mapped)
      
      // Keep selected message details in sync
      if (selectedMessage) {
        const currentSelected = mapped.find(m => m.id === selectedMessage.id)
        if (currentSelected) {
          setSelectedMessage(currentSelected)
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!confirm('Are you sure you want to delete this message?')) return
    
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting message')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    setActionLoading(true)
    setIsStatusDropdownOpen(false)
    
    try {
      // Write directly to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state only if database write was successful
      const updatedMessages = messages.map(m => m.id === id ? { ...m, status: newStatus } : m)
      setMessages(updatedMessages)
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (err: any) {
      console.error('Status change error:', err)
      alert(err.message || 'Failed to update message status in Supabase')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSeedMessages = async () => {
    setActionLoading(true)
    try {
      const sampleMessages = [
        {
          name: 'Sarah Connor',
          email: 'sconnor@cyberdyne.io',
          phone: '+1 (555) 902-1984',
          company: 'Resistance Tech',
          services: ['Branding', 'Digital'],
          budget: '$25,000 - $50,000',
          message: 'We are launching a new visual platform designed to track cloud networks and automate system security. We need a bold brand identity, high-fidelity landing pages, and interactive WebGL elements that feel like the future.'
        },
        {
          name: 'Bruce Wayne',
          email: 'bwayne@waynecorp.com',
          phone: '+1 (800) Batman',
          company: 'Wayne Enterprises',
          services: ['Production', 'Campaigns'],
          budget: '$100,000+',
          message: 'Looking for a cinematic production agency to shoot high-end trailers for our new spatial computing device. Needs to convey premium craftsmanship, darkness, and high intelligence. Can you deliver within 6 weeks?'
        },
        {
          name: 'Tony Stark',
          email: 'tony@stark.arc',
          phone: null,
          company: 'Stark Industries',
          services: ['Digital', 'Branding'],
          budget: '$75,000 - $100,000',
          message: 'Need a complete rebrand for our clean energy consumer tech branch. Looking for ultra-clean layouts, glowing neon theme variables, and bold typography.'
        }
      ]

      const { error } = await supabase
        .from('contact_messages')
        .insert(sampleMessages)

      if (error) throw error
      fetchMessages()
    } catch (err: any) {
      alert(err.message || 'Error seeding messages')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'read':
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
      case 'replied':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      case 'archived':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/20'
    }
  }

  const getStatusDotClass = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-primary shadow-[0_0_8px_#ED3F27]'
      case 'read':
        return 'bg-white/30'
      case 'replied':
        return 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'
      case 'archived':
        return 'bg-[#BF5AF2]/50'
      default:
        return 'bg-primary'
    }
  }

  // Filter messages based on status and search query
  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.company && m.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Mail className="h-4 w-4 text-[#ED3F27]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Inbox HQ</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            Lead Inquiries & Messages
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Read, filter, search, and manage corporate business inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {messages.length === 0 && !loading && (
            <button
              onClick={handleSeedMessages}
              disabled={actionLoading}
              className="flex items-center gap-2 border border-[#ED3F27]/20 bg-[#ED3F27]/10 hover:bg-[#ED3F27]/20 text-[#ED3F27] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Seed Sample Leads</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls: Search and Status Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search leads, company, or insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/5 bg-[#121212]/80 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 border border-white/5 bg-[#121212]/40 p-1 rounded-xl">
          {['All', 'new', 'read', 'replied', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-white/60 hover:text-white/80 border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container: Split Pane */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#ED3F27] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/[0.005]">
          <Mail className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inbox is Empty</h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto mt-2">
            No contact submissions have been logged. You can seed some mock leads to verify the dashboard layout.
          </p>
          <button
            onClick={handleSeedMessages}
            className="mt-6 flex items-center gap-2 border border-white/10 hover:border-white/20 bg-[#121212] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 mx-auto cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#ED3F27]" />
            <span>Seed Demo Leads</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inbox List (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredMessages.length === 0 ? (
              <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-center p-6 bg-white/[0.005]">
                <p className="text-xs text-white/30">No messages matching this filter.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`border p-5 rounded-2xl cursor-pointer transition-all duration-250 relative group ${
                      isSelected 
                        ? 'bg-[#121212] border-[#ED3F27]/30 shadow-lg shadow-[#ED3F27]/5' 
                        : 'bg-[#121212]/50 border-white/5 hover:border-white/10 hover:bg-[#121212]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Status Dot */}
                        <span 
                          className={`h-2 w-2 rounded-full shrink-0 ${getStatusDotClass(msg.status)}`}
                          title={`Status: ${msg.status}`}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black uppercase tracking-wider text-white truncate">{msg.name}</h4>
                          <p className="text-[10px] text-white/60 font-mono mt-0.5 truncate">{msg.company || 'Personal'}</p>
                        </div>
                      </div>

                      <span className="text-[9px] text-white/20 font-mono flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed border-t border-white/5 pt-2.5 mt-2">
                      {msg.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {msg.services && msg.services.slice(0, 2).map((srv) => (
                          <span key={srv} className="text-[8px] font-bold bg-[#ED3F27]/5 text-[#ED3F27] border border-[#ED3F27]/10 px-1.5 py-0.5 rounded">
                            {srv}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-1.5 rounded-lg border border-white/5 bg-[#121212] hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Inspector (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/5 p-6 rounded-2xl min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-[#ED3F27]" />
                          <h3 className="text-sm font-black uppercase tracking-tight text-white">{selectedMessage.name}</h3>
                          
                          {/* Selected Message Status Badge */}
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(selectedMessage.status)}`}>
                            {selectedMessage.status}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-white/60">
                          Email: <a href={`mailto:${selectedMessage.email}`} className="text-[#ED3F27]/80 hover:text-[#ED3F27] underline">{selectedMessage.email}</a>
                        </p>
                        {selectedMessage.phone && (
                          <p className="text-xs font-mono text-white/60 mt-1">
                            Phone: <span className="text-white/60">{selectedMessage.phone}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Change Status Dropdown Selector */}
                        <div className="relative">
                          <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="flex items-center gap-2 border border-white/10 bg-[#121212] hover:bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            <span>Status</span>
                            <ChevronDown className="h-3 w-3" />
                          </button>

                          {isStatusDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                              <div className="absolute right-0 mt-2 w-32 bg-[#121212] border border-white/5 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                {['new', 'read', 'replied', 'archived'].map((statusOption) => {
                                  const isCurrent = selectedMessage.status === statusOption
                                  return (
                                    <button
                                      key={statusOption}
                                      onClick={() => handleStatusChange(selectedMessage.id, statusOption as any)}
                                      className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between hover:bg-[#121212] transition-all ${
                                        isCurrent ? 'text-[#ED3F27]' : 'text-white/60 hover:text-white'
                                      }`}
                                    >
                                      <span>{statusOption}</span>
                                      {isCurrent && <Check className="h-3 w-3" />}
                                    </button>
                                  )
                                })}
                              </div>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="flex items-center gap-2 border border-white/10 hover:border-red-500/20 hover:text-red-400 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 text-white/60 text-[9px] font-mono uppercase mb-1">
                          <Building2 className="h-3 w-3" />
                          <span>Organization</span>
                        </div>
                        <p className="text-xs font-bold text-white">{selectedMessage.company || 'Not Specified'}</p>
                      </div>

                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <div className="flex items-center gap-1.5 text-white/60 text-[9px] font-mono uppercase mb-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Budget Scope</span>
                        </div>
                        <p className="text-xs font-bold text-white">{selectedMessage.budget || 'Not Specified'}</p>
                      </div>
                    </div>

                    {/* Services Requested */}
                    {selectedMessage.services && selectedMessage.services.length > 0 && (
                      <div className="space-y-1.5">
                        <h5 className="text-[9px] font-mono uppercase text-white/60 tracking-wider">Services Requested</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedMessage.services.map((srv) => (
                            <span key={srv} className="text-[10px] font-bold bg-[#ED3F27]/10 text-[#ED3F27] border border-[#ED3F27]/20 px-3 py-1 rounded-full">
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inquiry message content */}
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <h5 className="text-[9px] font-mono uppercase text-white/60 tracking-wider">Message Description</h5>
                      <div className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl text-xs text-white/85 leading-relaxed max-h-[200px] overflow-y-auto whitespace-pre-wrap font-sans">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>

                  {/* Footer Timestamp */}
                  <div className="pt-6 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center justify-between mt-6">
                    <span>Inquiry Logged</span>
                    <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                  </div>

                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-white/30 py-20">
                  <Mail className="h-10 w-10 text-white/10 mb-2" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">No Message Selected</h4>
                  <p className="text-[10px] text-white/60 max-w-xs mx-auto mt-1">
                    Select an inquiry from the inbox column to inspect its details, contact credentials, and budget range.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  )
}
