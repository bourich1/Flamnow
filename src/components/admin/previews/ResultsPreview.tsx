'use client'

import React from 'react'
import { Eye, Users, FolderKanban, DollarSign, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Eye,
  Users,
  FolderKanban,
  DollarSign
}

interface ResultsPreviewProps {
  id: string
  label: string
  displayVal: string
  rawVal: string
  prefix: string
  suffix: string
  iconName: 'Eye' | 'Users' | 'FolderKanban' | 'DollarSign'
  color: string
  detail: string
}

export default function ResultsPreview({
  label,
  displayVal,
  prefix,
  suffix,
  iconName,
  color,
  detail,
}: ResultsPreviewProps) {
  const Icon = iconMap[iconName] || Eye

  return (
    <div
      className="group relative bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] overflow-hidden transition-all duration-300 text-left w-full max-w-xs mx-auto shadow-2xl cursor-default"
    >
      {/* Radial Glow Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-radial transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at top right, ${color || '#ED3F27'}15 0%, transparent 60%)`,
        }}
      />

      {/* Card Top: Icon & Indicator */}
      <div className="flex justify-between items-center">
        <div
          className="h-10 w-10 rounded-2xl border flex items-center justify-center transition-colors duration-500"
          style={{
            color: color || '#ED3F27',
            borderColor: `${color || '#ED3F27'}20`,
            backgroundColor: `${color || '#ED3F27'}10`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: color || '#ED3F27',
            boxShadow: `0 0 10px ${color || '#ED3F27'}`,
          }}
        />
      </div>

      {/* Card Center */}
      <div className="mt-6 flex flex-col">
        <span
          className="text-3xl sm:text-4xl font-black tracking-tight font-display leading-none"
          style={{ color: color || '#ED3F27' }}
        >
          {prefix}{displayVal || '0'}{suffix}
        </span>
        
        <h3 className="text-xs font-bold text-white uppercase tracking-tight mt-2">
          {label || 'Metric Label'}
        </h3>
      </div>

      {/* Card Bottom */}
      <p className="text-white/40 text-[10px] leading-relaxed mt-3 border-t border-white/5 pt-2 font-sans">
        {detail || 'Details about the metric attribution.'}
      </p>
    </div>
  )
}
