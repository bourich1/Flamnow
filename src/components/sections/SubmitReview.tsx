'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Upload, CheckCircle2, Loader2, MessageSquareQuote, X } from 'lucide-react'
import { Bars } from "@/components/bars"
import { submitTestimonialReview } from '@/app/actions/submitReview'

export default function SubmitReview() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      formData.append('rating', rating.toString())
      
      const result = await submitTestimonialReview(formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setIsSuccess(true)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsOpen(false)
    setTimeout(() => {
      setIsSuccess(false)
      setRating(5)
      setHoveredRating(0)
      setError('')
      setFileName('')
    }, 300)
  }

  return (
    <>
      <div className="flex justify-center mt-12 mb-8 relative z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 bg-gradient-to-r from-[#ED3F27] to-[#FF9F0A] hover:from-[#ED3F27]/90 hover:to-[#FF9F0A]/90 text-white font-bold rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(237,63,39,0.3)] flex items-center gap-2"
        >
          <MessageSquareQuote className="h-5 w-5" />
          Add Feedback
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111111] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={resetForm}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Review Submitted!</h3>
                  <p className="text-white/60 mb-8">Your request is being processed. (rah tytem mo3alajat talab)</p>
                  <button 
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors w-full max-w-xs mx-auto"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                      Leave a Review
                    </h2>
                    <p className="text-white/60">
                      We value your feedback. Let us know how your experience was.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Honeypot field (hidden) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-semibold text-white/80 uppercase tracking-wider">Full Name <span className="text-[#ED3F27]">*</span></label>
                        <input 
                          type="text" 
                          id="fullName" 
                          name="fullName" 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ED3F27]/50 focus:bg-white/10 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-semibold text-white/80 uppercase tracking-wider">Company</label>
                        <input 
                          type="text" 
                          id="company" 
                          name="company" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ED3F27]/50 focus:bg-white/10 transition-colors"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label htmlFor="position" className="text-sm font-semibold text-white/80 uppercase tracking-wider">Position</label>
                        <input 
                          type="text" 
                          id="position" 
                          name="position" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ED3F27]/50 focus:bg-white/10 transition-colors"
                          placeholder="CEO"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/80 uppercase tracking-wider block mb-2">Profile Image</label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-3 text-white/60 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{fileName || 'Upload Photo (Optional)'}</span>
                        </button>
                        <input 
                          type="file" 
                          name="image"
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-semibold text-white/80 uppercase tracking-wider block mb-3">Rating <span className="text-[#ED3F27]">*</span></label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`h-8 w-8 transition-colors ${
                                (hoveredRating || rating) >= star 
                                  ? 'fill-[#FF9F0A] text-[#FF9F0A]' 
                                  : 'fill-transparent text-white/20'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <label htmlFor="message" className="text-sm font-semibold text-white/80 uppercase tracking-wider block mb-2">Review <span className="text-[#ED3F27]">*</span></label>
                      <textarea 
                        id="message" 
                        name="message" 
                        required
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ED3F27]/50 focus:bg-white/10 transition-colors resize-none"
                        placeholder="What did you enjoy about working with us?"
                      />
                    </div>

                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ED3F27] to-[#FF9F0A] hover:from-[#ED3F27]/90 hover:to-[#FF9F0A]/90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Bars className="h-5 w-6 text-white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Review</span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
