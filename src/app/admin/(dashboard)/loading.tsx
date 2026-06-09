'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminDashboardLoading() {
  return (
    <div className="h-96 flex flex-col items-center justify-center text-center text-white/40">
      {/* Small Cyber Spinner */}
      <div className="relative h-10 w-10 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-[#ED3F27] animate-spin" />
        <Loader2 className="h-5 w-5 animate-spin text-[#ED3F27] absolute top-2.5 left-2.5" />
      </div>
      <p className="text-[10px] font-mono uppercase tracking-widest">Compiling parameters...</p>
    </div>
  )
}
