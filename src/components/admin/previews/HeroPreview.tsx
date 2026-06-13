'use client'

import React from 'react'
import { ArrowUpRight, Cpu, LineChart, Target, Zap } from 'lucide-react'

interface HeroPreviewProps {
  badge: string
  title_1: string
  title_stroke: string
  title_2: string
  description: string
  primary_btn_text: string
  primary_btn_url: string
  secondary_btn_text: string
  secondary_btn_url: string
  speed_card_title: string
  speed_card_value: string
  speed_card_sub: string
  roi_card_title: string
  roi_card_value: string
  ctr_card_title: string
  ctr_card_value: string
  ctr_card_sub: string
  focusedField?: string | null
}

export default function HeroPreview({
  badge,
  title_1,
  title_stroke,
  title_2,
  description,
  primary_btn_text,
  secondary_btn_text,
  speed_card_title,
  speed_card_value,
  speed_card_sub,
  roi_card_title,
  roi_card_value,
  ctr_card_title,
  ctr_card_value,
  ctr_card_sub,
  focusedField,
}: HeroPreviewProps) {
  const getHighlight = (field: string) => {
    return focusedField === field 
      ? 'ring-2 ring-[#ED3F27] bg-[#ED3F27]/10 rounded px-1 -mx-1 transition-all duration-300 shadow-[0_0_15px_rgba(237,63,39,0.2)]' 
      : 'transition-all duration-300'
  }
  
  return (
    <div className="relative w-full bg-bg-base border border-border-theme rounded-3xl overflow-hidden p-6 md:p-10 text-left shadow-2xl flex flex-col justify-center min-h-[500px]">
      {/* Visual Background grid and glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Form Output Content */}
        <div className="lg:col-span-7 flex flex-col gap-4 items-start">
          
          {/* Badge */}
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className={`text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded font-mono inline-block ${getHighlight('badge')}`}>
              {badge || 'Creative Agency'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[0.95] font-display">
            <span className={`block inline-block ${getHighlight('title1')}`}>{title_1 || 'We Ignite'}</span>
            <span className={`block text-transparent stroke-text inline-block ${getHighlight('titleStroke')}`} style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>
              {title_stroke || 'Untamed'}
            </span>
            <span className={`block text-[#ED3F27] inline-block ${getHighlight('title2')}`}>{title_2 || 'Growth.'}</span>
          </h1>

          {/* Description */}
          <p className={`text-white/60 text-xs sm:text-sm leading-relaxed max-w-md font-sans inline-block ${getHighlight('description')}`}>
            {description || 'Write a compelling corporate value proposition supporting the headline above.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              type="button"
              className={`rounded-lg bg-[#ED3F27] text-white font-bold uppercase tracking-widest text-[9px] px-6 py-3 flex items-center gap-1.5 transition-all ${getHighlight('primaryBtnText')} ${getHighlight('primaryBtnUrl')}`}
            >
              {primary_btn_text || 'Let\'s Stoke'}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className={`rounded-lg border border-white/10 bg-transparent text-white font-bold uppercase tracking-widest text-[9px] px-6 py-3 transition-all ${getHighlight('secondaryBtnText')} ${getHighlight('secondaryBtnUrl')}`}
            >
              {secondary_btn_text || 'Our Chronicles'}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Mockup Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4 relative">
          
          {/* Mockup Spline Area */}
          <div className="w-full h-40 bg-neutral-900/50 border border-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Zap className="h-8 w-8 text-[#ED3F27] mb-1 animate-pulse" />
              <span className="text-[10px] font-mono uppercase text-white/35">SPLINE 3D MASCOT WORLD</span>
            </div>
          </div>

          {/* Floating Cards (Rendered stacked in preview) */}
          <div className="grid grid-cols-1 gap-3">
            
            {/* Speed Card */}
            <div className={`bg-[#121212] border border-white/5 p-3 rounded-2xl flex items-center gap-3 ${focusedField?.startsWith('speedCard') ? 'ring-2 ring-green-500/50 scale-[1.02]' : ''} transition-all duration-300`}>
              <div className="h-8 w-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0 font-mono">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="overflow-hidden flex flex-col items-start">
                <p className={`text-[8px] font-bold text-white/40 uppercase tracking-widest truncate inline-block ${getHighlight('speedCardTitle')}`}>{speed_card_title || 'Flagship App'}</p>
                <p className={`text-[10px] font-bold text-white truncate font-mono mt-0.5 inline-block ${getHighlight('speedCardValue')}`}>{speed_card_value || 'Load Speed: 0.4s'}</p>
                <p className={`text-[7px] font-mono text-green-400 mt-0.5 inline-block ${getHighlight('speedCardSub')}`}>{speed_card_sub || 'VITALS 100%'}</p>
              </div>
            </div>

            {/* ROI Card */}
            <div className={`bg-[#121212] border border-white/5 p-3 rounded-2xl flex items-center gap-3 ${focusedField?.startsWith('roiCard') ? 'ring-2 ring-[#ED3F27]/50 scale-[1.02]' : ''} transition-all duration-300`}>
              <div className="h-8 w-8 rounded-lg bg-[#ED3F27]/10 border border-[#ED3F27]/20 flex items-center justify-center text-[#ED3F27] shrink-0">
                <LineChart className="h-4 w-4" />
              </div>
              <div className="overflow-hidden w-full flex flex-col items-start">
                <p className={`text-[8px] font-bold text-white/40 uppercase tracking-widest truncate inline-block ${getHighlight('roiCardTitle')}`}>{roi_card_title || 'Campaign ROI'}</p>
                <p className={`text-[10px] font-black text-white truncate font-mono mt-0.5 inline-block ${getHighlight('roiCardValue')}`}>{roi_card_value || 'Attributed: 4.8x'}</p>
              </div>
            </div>

            {/* CTR Card */}
            <div className={`bg-[#121212] border border-white/5 p-3 rounded-2xl flex items-center gap-3 ${focusedField?.startsWith('ctrCard') ? 'ring-2 ring-cyan-500/50 scale-[1.02]' : ''} transition-all duration-300`}>
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Target className="h-4 w-4" />
              </div>
              <div className="overflow-hidden flex flex-col items-start">
                <p className={`text-[8px] font-bold text-white/40 uppercase tracking-widest truncate inline-block ${getHighlight('ctrCardTitle')}`}>{ctr_card_title || 'Ads Performance'}</p>
                <p className={`text-[10px] font-bold text-white truncate font-mono mt-0.5 inline-block ${getHighlight('ctrCardValue')}`}>{ctr_card_value || 'CTR Rate: 6.2%'}</p>
                <p className={`text-[7px] font-mono text-cyan-400 mt-0.5 inline-block ${getHighlight('ctrCardSub')}`}>{ctr_card_sub || '+22% ABOVE BM'}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
