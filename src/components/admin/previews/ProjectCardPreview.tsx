'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'

interface ProjectCardPreviewProps {
  id: string
  title: string
  client: string
  category: string
  year: string
  tagline: string
  description: string
  color: string
  accent_color: string
  cover_image: string
  focusedField?: string | null
}

export default function ProjectCardPreview({
  title,
  category,
  year,
  description,
  tagline,
  color,
  accent_color,
  cover_image,
  focusedField,
}: ProjectCardPreviewProps) {
  const getHighlight = (field: string) => {
    return focusedField === field ? 'ring-2 ring-[#ED3F27] rounded transition-all' : ''
  }
  return (
    <div
      className="group relative flex flex-col bg-[#121212] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-white/15 cursor-pointer text-left w-full max-w-md mx-auto shadow-2xl"
    >
      {/* Visual Accent Glow on Hover */}
      <div
        className="absolute inset-0 -z-10 bg-radial transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${accent_color || 'rgba(237,63,39,0.1)'} 0%, transparent 70%)`,
        }}
      />

      {/* Cover Image Container */}
      <div className={`relative h-[200px] w-full overflow-hidden bg-neutral-900 flex items-center justify-center ${getHighlight('formCoverImage')}`}>
        {cover_image ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent z-10" />
            <img
              src={cover_image}
              alt="Project Cover mockup"
              className="object-cover w-full h-full transition-transform duration-700 ease-out"
            />
          </>
        ) : (
          <div className="text-white/20 text-xs font-mono">No Cover Image Selected</div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col gap-4 relative z-20">
        <div className="flex justify-between items-center">
          <span
            className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-mono ${getHighlight('formCategory')}`}
            style={{
              color: color || '#ED3F27',
              borderColor: `${color || '#ED3F27'}30`,
              backgroundColor: `${color || '#ED3F27'}10`,
            }}
          >
            {category || 'Category'}
          </span>
          <span className={`text-[10px] text-white/40 font-mono font-bold uppercase ${getHighlight('formYear')}`}>
            {year || '2026'}
          </span>
        </div>

        <div>
          <h2 className={`text-xl font-black text-white uppercase tracking-tight font-display leading-tight ${getHighlight('formTitle')}`}>
            {title || 'Project Case Study Title'}
          </h2>
          {tagline && (
            <p className={`text-[10px] font-medium italic text-white/50 mt-1 ${getHighlight('formTagline')}`}>
              &ldquo;{tagline}&rdquo;
            </p>
          )}
        </div>

        <p className={`text-white/60 text-xs leading-relaxed font-sans ${getHighlight('formDescription')}`}>
          {description || 'Provide a brief summary of the client and project execution details.'}
        </p>

        {/* Card Bottom CTA */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-primary-base transition-colors duration-300">
            Explore Case Study
          </span>
          <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
            <ArrowUpRight className="h-4.5 w-4.5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
