'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an external analytics service if configured
    console.error('Unhandled Runtime Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-center px-6 py-12 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md space-y-6">
        {/* Error Icon */}
        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-lg shadow-red-500/5">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">
            System Collision Detected
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
            An unexpected process exception occurred while compiling this page. Please try triggering recovery.
          </p>
        </div>

        {error.digest && (
          <div className="bg-[#181818] border border-white/5 p-3 rounded-xl max-w-xs mx-auto">
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Error Signature</p>
            <p className="text-[10px] font-mono text-white/50 truncate mt-0.5">{error.digest}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 mx-auto cursor-pointer hover:bg-[#ED3F27]/10 hover:border-[#ED3F27]/30 hover:text-white"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Trigger Recovery</span>
          </button>
        </div>
      </div>
    </div>
  )
}
