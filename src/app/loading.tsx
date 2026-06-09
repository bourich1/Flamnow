'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#111111] flex flex-col items-center justify-center text-center px-4">
      {/* Animated Glowing Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-[#ED3F27]/10 blur-[80px] pointer-events-none animate-pulse" />
      
      <div className="space-y-6">
        {/* Spinner */}
        <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/5 border-t-[#ED3F27] animate-spin" />
          <div className="absolute h-10 w-10 rounded-full border border-white/5 border-b-[#FF9F0A] animate-spin [animation-direction:reverse]" />
          <Loader2 className="h-5 w-5 animate-spin text-[#ED3F27]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/90 font-display">
            IGNITING STREAM
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Compiling assets and loading parameters...
          </p>
        </div>
      </div>
    </div>
  )
}
