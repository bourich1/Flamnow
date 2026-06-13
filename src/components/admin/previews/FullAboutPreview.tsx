'use client'

import React from 'react'
import { Target, ArrowUpRight } from 'lucide-react'
import { getIconByName } from '@/lib/iconMap'

interface AboutValue {
  iconName: string
  title: string
  desc: string
}

interface FullAboutPreviewProps {
  narrativeTag: string
  narrativeTitle: string
  narrativeDesc1: string
  narrativeSubtitle: string
  narrativeDesc2: string
  narrativeDesc3: string
  missionTag: string
  missionTitle: string
  philosophyTag: string
  philosophyTitle: string
  philosophyDesc: string
  teamTag: string
  teamTitle: string
  teamDesc: string
  aboutValues: AboutValue[]
  focusedField?: string | null
}

export default function FullAboutPreview(props: FullAboutPreviewProps) {
  const getHighlight = (field: string) => {
    return props.focusedField === field 
      ? 'ring-2 ring-[#ED3F27] bg-[#ED3F27]/10 rounded px-1 -mx-1 transition-all duration-300 shadow-[0_0_15px_rgba(237,63,39,0.2)]' 
      : 'transition-all duration-300'
  }

  const getValueHighlight = (idx: number, field: string) => {
    return props.focusedField === `value_${idx}_${field}`
      ? 'ring-2 ring-[#ED3F27] bg-[#ED3F27]/10 rounded px-1 -mx-1 transition-all duration-300 shadow-[0_0_15px_rgba(237,63,39,0.2)]'
      : 'transition-all duration-300'
  }

  const getCardHighlight = (idx: number) => {
    return props.focusedField?.startsWith(`value_${idx}_`)
      ? 'ring-2 ring-[#ED3F27] shadow-[0_0_20px_rgba(237,63,39,0.15)] scale-[1.02] transition-all duration-300'
      : 'transition-all duration-300'
  }

  return (
    <div className="w-full bg-[#0a0a0a] rounded-2xl overflow-y-auto overflow-x-hidden border border-white/10 shadow-2xl relative" style={{ maxHeight: '70vh' }}>
      
      {/* Mini Navbar Mock */}
      <div className="sticky top-0 z-20 w-full h-10 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/5 flex items-center px-4">
        <div className="h-4 w-4 bg-white/20 rounded-full" />
        <div className="ml-auto flex gap-2">
          <div className="h-1 w-4 bg-white/20 rounded" />
          <div className="h-1 w-4 bg-white/20 rounded" />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-10">
        
        {/* Section 1: Narrative */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 items-start">
            <span className={`text-[8px] font-bold uppercase tracking-widest text-[#ED3F27] inline-block ${getHighlight('narrativeTag')}`}>
              {props.narrativeTag || 'Our Narrative'}
            </span>
            <h1 className={`text-2xl font-black uppercase tracking-tight text-white leading-tight font-display inline-block ${getHighlight('narrativeTitle')}`}>
              {props.narrativeTitle || 'Title...'}
            </h1>
            <p className={`text-white/60 text-[10px] leading-relaxed font-body whitespace-pre-wrap inline-block ${getHighlight('narrativeDesc1')}`}>
              {props.narrativeDesc1 || 'Desc 1...'}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 items-start">
            <h2 className={`text-lg font-black uppercase tracking-tight text-white leading-tight font-display inline-block ${getHighlight('narrativeSubtitle')}`}>
              {props.narrativeSubtitle || 'Subtitle...'}
            </h2>
            <div className="flex flex-col gap-3 text-white/60 leading-relaxed text-[10px] font-body items-start">
              <p className={`whitespace-pre-wrap inline-block ${getHighlight('narrativeDesc2')}`}>{props.narrativeDesc2 || 'Desc 2...'}</p>
              <p className={`whitespace-pre-wrap inline-block ${getHighlight('narrativeDesc3')}`}>{props.narrativeDesc3 || 'Desc 3...'}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Mission */}
        <div className={`relative bg-[#121212] border border-white/5 rounded-xl p-6 overflow-hidden flex flex-col gap-6 ${props.focusedField?.startsWith('mission') ? 'ring-1 ring-[#ED3F27] shadow-[0_0_20px_rgba(237,63,39,0.1)]' : ''}`}>
          <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#ED3F27]/10 blur-xl pointer-events-none" />
          
          <div className="flex flex-col gap-3 relative z-10 items-start">
            <div className={`flex items-center gap-1.5 text-[#ED3F27] ${getHighlight('missionTag')}`}>
              <Target className="h-3.5 w-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">
                {props.missionTag || 'Our Mission'}
              </span>
            </div>
            <h2 className={`text-xl font-black text-white uppercase tracking-tight font-display leading-tight whitespace-pre-wrap inline-block ${getHighlight('missionTitle')}`}>
              {props.missionTitle || 'Mission Title...'}
            </h2>
          </div>

          <div className="shrink-0 relative z-10">
            <div className="inline-block rounded-lg bg-white text-black font-bold uppercase tracking-widest text-[8px] px-4 py-2">
              Collaborate
            </div>
          </div>
        </div>

        {/* Section 3: Values */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-start">
            <span className={`text-[8px] font-bold uppercase tracking-widest text-[#ED3F27] inline-block ${getHighlight('philosophyTag')}`}>
              {props.philosophyTag || 'Tag...'}
            </span>
            <h2 className={`text-xl font-black uppercase tracking-tight text-white leading-tight font-display inline-block ${getHighlight('philosophyTitle')}`}>
              {props.philosophyTitle || 'Title...'}
            </h2>
            <p className={`text-white/50 text-[10px] leading-relaxed font-body inline-block ${getHighlight('philosophyDesc')}`}>
              {props.philosophyDesc || 'Desc...'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {props.aboutValues.map((val, idx) => {
              const Icon = getIconByName(val.iconName)
              return (
                <div key={idx} className={`bg-[#121212] border border-white/5 rounded-xl p-4 flex flex-col gap-4 ${getCardHighlight(idx)}`}>
                  <div className={`h-8 w-8 rounded-lg bg-[#ED3F27]/10 border border-[#ED3F27]/20 flex items-center justify-center text-[#ED3F27] ${getValueHighlight(idx, 'iconName')}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className={`text-sm font-bold text-white uppercase tracking-tight mb-1 font-display inline-block ${getValueHighlight(idx, 'title')}`}>{val.title || 'Title'}</h3>
                    <p className={`text-white/50 text-[9px] leading-relaxed font-body inline-block ${getValueHighlight(idx, 'desc')}`}>{val.desc || 'Desc'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 4: Team Headers */}
        <div className="flex flex-col gap-6 opacity-60">
          <div className="flex flex-col gap-2 items-start">
            <span className={`text-[8px] font-bold uppercase tracking-widest text-[#ED3F27] inline-block ${getHighlight('teamTag')}`}>
              {props.teamTag || 'Tag...'}
            </span>
            <h2 className={`text-xl font-black uppercase tracking-tight text-white leading-tight font-display inline-block ${getHighlight('teamTitle')}`}>
              {props.teamTitle || 'Title...'}
            </h2>
            <p className={`text-white/50 text-[10px] leading-relaxed font-body inline-block ${getHighlight('teamDesc')}`}>
              {props.teamDesc || 'Desc...'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#121212] border border-white/5 rounded-xl p-3 flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="h-2 w-12 bg-[#ED3F27]/20 rounded mb-3" />
                  <div className="h-3 w-16 bg-white/80 rounded mb-1" />
                  <div className="h-2 w-10 bg-white/40 rounded mb-3" />
                  <div className="h-1.5 w-full bg-white/20 rounded mb-1" />
                  <div className="h-1.5 w-4/5 bg-white/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
