'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  ClipboardList, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Loader2, 
  Star,
  ExternalLink
} from 'lucide-react'

interface PendingTestimonial {
  id: string
  full_name: string
  company: string | null
  position: string | null
  rating: number
  message: string
  image_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function ReviewSubmissionsPage() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<PendingTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchReviews() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pending_testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching pending testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (review: PendingTestimonial) => {
    setActionLoading(review.id)
    try {
      // 1. Update status to approved
      const { error: updateError } = await supabase
        .from('pending_testimonials')
        .update({ status: 'approved' })
        .eq('id', review.id)

      if (updateError) throw updateError

      // 2. Copy to testimonials table
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: review.full_name,
          role: review.position || '',
          company: review.company || '',
          quote: review.message,
          metric: '5/5',
          metric_label: 'Rating',
          image_url: review.image_url,
          rating: review.rating
        })

      if (insertError) {
        console.error('Failed to copy to testimonials:', insertError)
      } else {
        fetchReviews()
      }
    } catch (err) {
      console.error('Error approving review:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionLoading(id)
    try {
      const { error } = await supabase
        .from('pending_testimonials')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error
      fetchReviews()
    } catch (err) {
      console.error('Error rejecting review:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return
    setActionLoading(id)
    try {
      const { error } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error
      setReviews(reviews.filter(r => r.id !== id))
    } catch (err) {
      console.error('Error deleting review:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredReviews = reviews.filter(r => {
    if (r.status !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return r.full_name.toLowerCase().includes(q) || 
             r.message.toLowerCase().includes(q) || 
             (r.company && r.company.toLowerCase().includes(q))
    }
    return true
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ED3F27]/20 to-[#FF9F0A]/20 flex items-center justify-center border border-[#ED3F27]/20">
            <ClipboardList className="h-6 w-6 text-[#ED3F27]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Review Submissions</h2>
            <p className="text-sm text-white/50">Manage public testimonial submissions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            {['pending', 'approved', 'rejected'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
                      onFocus={() => setFocusedField('searchQuery')}
                      onBlur={() => setFocusedField(null)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#ED3F27]/50 focus:bg-white/10 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 min-h-[400px]">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-white/40">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-white/40">
            <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No {activeTab} reviews found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {review.image_url ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={review.image_url} alt={review.full_name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-bold border border-white/10">
                          {review.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-sm">{review.full_name}</h4>
                        <p className="text-xs text-white/60">
                          {review.position}{review.position && review.company ? ' at ' : ''}{review.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= review.rating ? 'fill-[#FF9F0A] text-[#FF9F0A]' : 'fill-transparent text-white/20'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-sm text-white/80 italic leading-relaxed line-clamp-4">
                    "{review.message}"
                  </p>
                </div>

                <div className="bg-black/20 p-3 border-t border-white/5 flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review)}
                        disabled={actionLoading === review.id}
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        {actionLoading === review.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        disabled={actionLoading === review.id}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        {actionLoading === review.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                        Reject
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors ml-auto"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
