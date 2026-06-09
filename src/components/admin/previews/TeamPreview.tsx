'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'

interface TeamPreviewProps {
  id: string
  name: string
  role: string
  bio: string
  specialty: string
  instagram: string
  linkedin: string
}

export default function TeamPreview({
  name,
  role,
  bio,
  specialty,
}: TeamPreviewProps) {
  return (
    <div
      className="group relative flex flex-col justify-between min-h-[380px] bg-[#121212] border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-white/10 text-left w-full max-w-xs mx-auto shadow-2xl"
    >
      <div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-[#ED3F27] bg-[#ED3F27]/10 border border-[#ED3F27]/20 px-3 py-1 rounded-full font-mono">
          {specialty || 'Specialty'}
        </span>
        <h3 className="text-lg font-black text-white uppercase tracking-tight mt-6 group-hover:text-primary-base transition-colors duration-200 font-display">
          {name || 'Team Member Name'}
        </h3>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 font-body">
          {role || 'Job Role / Title'}
        </p>
        <p className="text-white/60 text-xs mt-6 leading-relaxed font-body">
          {bio || 'Write a brief professional bio describing their expertise and contribution.'}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
        <div className="flex gap-4 font-body text-[10px] text-white/50">
          <span className="hover:text-white transition-colors duration-200 cursor-pointer">
            LinkedIn
          </span>
          <span className="hover:text-white transition-colors duration-200 cursor-pointer">
            Instagram
          </span>
        </div>
        <div className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center text-white/50 group-hover:border-primary-base group-hover:text-primary-base transition-all duration-300 bg-white/5">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}
