'use client'

import React from 'react'

interface NavbarPreviewProps {
  siteName: string
}

export default function NavbarPreview({ siteName }: NavbarPreviewProps) {
  const nameFirstPart = siteName.slice(0, Math.ceil(siteName.length / 2)).toUpperCase()
  const nameSecondPart = siteName.slice(Math.ceil(siteName.length / 2)).toUpperCase()

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-auto text-left">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#FF9F0A] mb-4">
        Navbar Brand Preview
      </h4>

      <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl py-4 px-6 flex items-center justify-between">
        {/* Logo preview */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-black tracking-tighter text-white">
            {nameFirstPart}<span className="text-[#ED3F27]">{nameSecondPart}</span>
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#ED3F27]" />
        </div>

        {/* Dummy Links */}
        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-white/55">
          <span>Projects</span>
          <span>Services</span>
          <span>About</span>
          <span className="bg-white text-black px-2.5 py-1 rounded-full text-[8px] font-black">CTA</span>
        </div>
      </div>
    </div>
  )
}
