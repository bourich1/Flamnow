'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'

interface ContactPreviewProps {
  label: string
  title: string
  subtitle: string
  description: string
  button_text: string
  button_url: string
  focusedField?: string | null
}

export default function ContactPreview({
  label,
  title,
  subtitle,
  description,
  button_text,
  focusedField,
}: ContactPreviewProps) {
  const getHighlight = (field: string) => {
    return focusedField === field ? 'ring-2 ring-[#ED3F27] rounded transition-all' : ''
  }
  return (
    <div className="relative w-full bg-[#111111] border border-white/5 rounded-3xl py-12 px-6 overflow-hidden text-center shadow-2xl flex flex-col items-center gap-6 justify-center max-w-2xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-64 w-64 rounded-full bg-[#ED3F27]/10 blur-[80px] pointer-events-none" />

      <span className={`text-[10px] font-bold uppercase tracking-widest text-[#ED3F27] font-mono ${getHighlight('formLabel')}`}>
        {label || 'LAUNCH PROJECT'}
      </span>
      
      <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none font-display ${getHighlight('formTitle')}`}>
        {title || 'READY TO STOKE'} <br />
        <span className={`text-transparent stroke-text ${getHighlight('formSubtitle')}`} style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)" }}>
          {subtitle || 'THE FLAMES?'}
        </span>
      </h2>
      
      <p className={`text-white/60 text-xs sm:text-sm max-w-md leading-relaxed font-sans ${getHighlight('formDescription')}`}>
        {description || 'Let\'s collaborate on building the next generation of creative digital flagships.'}
      </p>

      <div className="mt-2">
        <button
          type="button"
          className={`rounded-full bg-[#ED3F27] hover:bg-white text-white hover:text-black font-bold uppercase tracking-widest text-[10px] px-8 py-3.5 flex items-center gap-2 transition-colors duration-300 ${getHighlight('formButtonText')}`}
        >
          {button_text || 'Stoke the Fire'}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
