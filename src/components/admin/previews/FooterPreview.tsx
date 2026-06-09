'use client'

import React from 'react'

interface FooterPreviewProps {
  siteName: string
  contactEmail: string
  contactPhone: string
  instagram: string
  linkedin: string
  twitter: string
}

export default function FooterPreview({
  siteName,
  contactEmail,
  contactPhone,
  instagram,
  linkedin,
  twitter
}: FooterPreviewProps) {
  const nameFirstPart = siteName.slice(0, Math.ceil(siteName.length / 2)).toUpperCase()
  const nameSecondPart = siteName.slice(Math.ceil(siteName.length / 2)).toUpperCase()

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-auto text-left">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#FF9F0A] mb-4">
        Footer Content Preview
      </h4>

      <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Brand block */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <span className="text-base font-black tracking-tighter text-white">
                {nameFirstPart}<span className="text-[#ED3F27]">{nameSecondPart}</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-[#ED3F27]" />
            </div>
            <p className="text-[9px] text-white/50 max-w-[180px] leading-relaxed">
              We design bold identities, high-performance campaigns, and premium digital flagships.
            </p>
          </div>

          {/* Socials & Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Connect</span>
              <div className="text-[9px] text-white/60 space-y-1 flex flex-col">
                <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-[#ED3F27]">Instagram</a>
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-[#ED3F27]">LinkedIn</a>
                <a href={twitter} target="_blank" rel="noreferrer" className="hover:text-[#ED3F27]">Twitter / X</a>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Coordinates</span>
              <div className="text-[9px] text-white/60 space-y-0.5">
                <p>{contactPhone || 'No telephone'}</p>
                <a href={`mailto:${contactEmail}`} className="text-[#ED3F27] hover:underline block truncate max-w-[100px]">{contactEmail || 'No email'}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Large outline logo */}
        <div className="border-t border-white/5 pt-4 text-center">
          <h3 
            className="text-3xl font-black text-transparent uppercase tracking-tighter"
            style={{ WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.08)' }}
          >
            {siteName}
          </h3>
        </div>
      </div>
    </div>
  )
}
