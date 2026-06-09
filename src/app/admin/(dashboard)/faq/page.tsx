'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import FAQPreview from '@/components/admin/previews/FAQPreview'
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  Loader2, 
  Info,
  Save
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function FAQAdminPage() {
  const supabase = createClient()
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form States
  const [formQuestion, setFormQuestion] = useState('')
  const [formAnswer, setFormAnswer] = useState('')

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchFaqs()
  }, [])

  async function fetchFaqs() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      const fList = data || []
      setFaqs(fList)

      if (fList.length > 0) {
        selectFaq(fList[0])
      } else {
        handleAddNew()
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectFaq = (faq: FAQItem) => {
    setEditingId(faq.id)
    setFormQuestion(faq.question)
    setFormAnswer(faq.answer)
    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormQuestion('How fast does Flamnow execute projects?')
    setFormAnswer('We work in structured sprints. A standard brand identity and Next.js landing page takes 3-4 weeks.')
    setValidationErrors({})
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id)

      if (error) throw error
      const remaining = faqs.filter(f => f.id !== id)
      setFaqs(remaining)
      setSuccessMsg('FAQ deleted successfully.')
      if (remaining.length > 0) {
        selectFaq(remaining[0])
      } else {
        handleAddNew()
      }
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      alert(err.message || 'Error deleting FAQ')
    } finally {
      setActionLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formQuestion.trim()) errors.question = 'Question is required.'
    if (!formAnswer.trim()) errors.answer = 'Answer description is required.'

    if (formQuestion.length > 150) errors.question = 'Question must be 150 characters or less.'
    if (formAnswer.length > 800) errors.answer = 'Answer must be 800 characters or less.'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please resolve form errors.')
      return
    }

    setActionLoading(true)
    const payload = {
      question: formQuestion.trim(),
      answer: formAnswer.trim()
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
        setSuccessMsg('FAQ item updated successfully.')
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([payload])
        if (error) throw error
        setSuccessMsg('New FAQ registered.')
      }

      // Refresh list
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true })
      setFaqs(data || [])
      
      // Select newly updated/created
      if (data && data.length > 0) {
        if (editingId) {
          const matched = data.find(f => f.id === editingId)
          if (matched) selectFaq(matched)
        } else {
          selectFaq(data[data.length - 1])
        }
      }
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving FAQ.')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <HelpCircle className="h-4 w-4 text-[#FF9F0A]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Self-service</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            FAQ Management
          </h2>
          <p className="text-xs text-muted-text mt-1">
            Publish questions and detailed responses. Previews update in real-time.
          </p>
        </div>

        <div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-primary hover:opacity-95 text-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#FF9F0A]/10 font-sans animate-pulse"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New FAQ</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF9F0A] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving FAQs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List Selector + Form Editor (Left column) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal FAQ Selector */}
            <div className="bg-surface-base border border-border-theme p-4 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-theme pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">
                  FAQ Registry ({faqs.length} items)
                </span>
                
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-text/50" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border-theme bg-bg-base text-[11px] text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id}
                    onClick={() => selectFaq(faq)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                      editingId === faq.id
                        ? 'border-[#FF9F0A] bg-[#FF9F0A]/5'
                        : 'border-border-theme bg-bg-base hover:bg-surface-base'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase text-foreground tracking-tight line-clamp-2 leading-relaxed">{faq.question}</h4>
                    </div>

                    <div className="flex justify-end items-center mt-4 pt-2 border-t border-border-theme">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(faq.id)
                        }}
                        className="text-muted-text/30 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete FAQ"
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
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF9F0A] font-bold">
                  {editingId ? 'Edit Selected FAQ' : 'Register New FAQ'}
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="text-[10px] font-mono text-primary hover:underline"
                  >
                    + Switch to New FAQ
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

              {/* Question */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How fast does Flamnow execute projects?"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#FF9F0A]/50 font-bold"
                />
                {validationErrors.question && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.question}</p>
                )}
              </div>

              {/* Answer */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text block font-mono">
                  Detailed Answer Response *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Provide a detailed and helpful response response..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-theme bg-bg-base text-xs text-foreground placeholder-white/20 focus:outline-none focus:border-[#FF9F0A]/50 resize-none leading-relaxed"
                />
                {validationErrors.answer && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.answer}</p>
                )}
              </div>

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
                  <span>Save FAQ Record</span>
                </button>
              </div>

            </form>
          </div>

          {/* Real-time Preview (Right column) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border-theme pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-text">
                Live Accordion Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <FAQPreview
              question={formQuestion}
              answer={formAnswer}
            />
          </div>

        </div>
      )}
    </div>
  )
}
