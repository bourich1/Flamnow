'use client'

import React from 'react'
import { Quote, Star } from 'lucide-react'

interface TestimonialPreviewProps {
  id: string
  name: string
  role: string
  company: string
  quote: string
  metric: string
  metric_label: string
  focusedField?: string | null
}

export default function TestimonialPreview({
  name,
  role,
  company,
  quote,
  metric,
  metric_label,
  focusedField,
}: TestimonialPreviewProps) {
  const getHighlight = (field: string) => {
    return focusedField === field ? 'ring-2 ring-[#ED3F27] rounded transition-all' : ''
  }
  const getInitials = (n: string) => {
    if (!n) return '?'
    return n
      .split(' ')
      .map((x) => x[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden min-h-[320px] flex flex-col justify-between shadow-2xl text-left w-full max-w-lg mx-auto">
      {/* Accent Quote Icon */}
      <Quote className="h-8 w-8 text-primary-base/10 absolute top-6 left-6" />

      <div className="relative flex-1 flex flex-col justify-center mt-4">
        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-[#ED3F27] text-[#ED3F27]" />
          ))}
        </div>

        {/* Quote */}
        <p className={`text-sm md:text-base font-medium text-white italic leading-relaxed font-body ${getHighlight('formQuote')}`}>
          &ldquo;{quote || 'Client review quote goes here.'}&rdquo;
        </p>

        {/* User Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6 mt-6 w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#ED3F27] to-[#ED3F27]/40 text-white font-bold flex items-center justify-center text-xs font-display shadow-lg select-none">
              {getInitials(name)}
            </div>
            <div>
              <p className={`text-xs font-black text-white font-display tracking-tight leading-none ${getHighlight('formName')}`}>
                {name || 'Client Name'}
              </p>
              <p className={`text-[9px] text-[#ED3F27] uppercase tracking-widest font-bold mt-1 leading-none ${getHighlight('formRole')} ${getHighlight('formCompany')}`}>
                {role || 'Role'}, {company || 'Company'}
              </p>
            </div>
          </div>

          {metric && (
            <div className="flex flex-col items-start sm:items-end font-mono">
              <span className={`text-xl font-black text-white font-display leading-none ${getHighlight('formMetric')}`}>
                {metric}
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-widest text-white/40 mt-1 leading-none ${getHighlight('formMetricLabel')}`}>
                {metric_label || 'Performance Boost'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
