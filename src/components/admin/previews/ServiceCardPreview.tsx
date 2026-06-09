'use client'

import React from 'react'
import { Sparkles, Target, Film, Laptop, Users, Check, ArrowUpRight, LucideIcon } from 'lucide-react'

// Helper to map string to Lucide icon
const getIcon = (id: string): LucideIcon => {
  switch (id) {
    case 'branding':
      return Sparkles
    case 'paid-ads':
      return Target
    case 'content-creation':
      return Film
    case 'website-design':
      return Laptop
    case 'social-media':
      return Users
    default:
      return Sparkles
  }
}

interface ServiceCardPreviewProps {
  id: string
  title: string
  tagline: string
  description: string
  features: string[]
  benefits?: string[]
  metric_label: string | null
  metric_value: string | null
  color: string
}

export default function ServiceCardPreview({
  id,
  title,
  tagline,
  description,
  features,
  metric_label,
  metric_value,
  color,
}: ServiceCardPreviewProps) {
  return (
    <div
      className="group relative bg-[#181818] border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[440px] overflow-hidden transition-all duration-500 hover:bg-[#1e1e1e] hover:-translate-y-2 hover:border-white/15 cursor-pointer text-left w-full max-w-sm mx-auto shadow-2xl"
    >
      {/* Radial Glow Overlay driven by service accent color */}
      <div
        className="absolute inset-0 -z-10 bg-radial transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at top right, ${color || '#ED3F27'}15 0%, transparent 60%)`,
        }}
      />

      {/* Card Top: Icon and Metric */}
      <div className="flex justify-between items-start">
        <div
          className="h-12 w-12 rounded-2xl border flex items-center justify-center transition-colors duration-500"
          style={{
            color: color || '#ED3F27',
            borderColor: `${color || '#ED3F27'}20`,
            backgroundColor: `${color || '#ED3F27'}10`,
          }}
        >
          {React.createElement(getIcon(id), { className: "h-6 w-6" })}
        </div>
        {(metric_value || metric_label) && (
          <div className="text-right font-mono">
            <p className="text-2xl font-black font-display leading-none" style={{ color: color || '#ED3F27' }}>
              {metric_value || '0.0x'}
            </p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/40 mt-1">
              {metric_label || 'Metric'}
            </p>
          </div>
        )}
      </div>

      {/* Card Center: Core Info */}
      <div className="flex flex-col gap-2 mt-6">
        <span className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: color || '#ED3F27' }}>
          {tagline || 'Tagline placeholder'}
        </span>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">
          {title || 'Service Title'}
        </h3>
        <p className="text-white/60 text-xs sm:text-sm leading-relaxed mt-1">
          {description || 'No description provided yet.'}
        </p>
      </div>

      {/* Card Bottom: Features List */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 font-mono">Competencies</p>
        <ul className="flex flex-col gap-2.5">
          {features && features.length > 0 ? (
            features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-center gap-2.5 text-xs text-white/70">
                <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                {feature}
              </li>
            ))
          ) : (
            <li className="text-xs text-white/40 italic">No features defined.</li>
          )}
        </ul>
      </div>

      {/* Link hover arrow action */}
      <div className="absolute bottom-6 right-6">
        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  )
}
