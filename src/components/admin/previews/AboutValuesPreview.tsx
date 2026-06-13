'use client'

import React from 'react'
import { getIconByName } from '@/lib/iconMap'

interface AboutValue {
  iconName: string
  title: string
  desc: string
}

interface AboutValuesPreviewProps {
  values: AboutValue[]
}

export default function AboutValuesPreview({ values }: AboutValuesPreviewProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {values.map((val, idx) => {
        const IconComponent = getIconByName(val.iconName)
        return (
          <div
            key={idx}
            className="bg-[#181818] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[160px] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="h-10 w-10 rounded-xl bg-[#ED3F27]/10 border border-[#ED3F27]/20 flex items-center justify-center text-[#ED3F27] mb-4">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1.5 font-display">
                {val.title || 'Value Title'}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed font-body">
                {val.desc || 'Provide a short description of the core value.'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
