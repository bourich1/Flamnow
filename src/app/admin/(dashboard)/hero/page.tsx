'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import HeroPreview from '@/components/admin/previews/HeroPreview'
import { Save, Loader2, Check, AlertCircle, Sparkles, RefreshCw } from 'lucide-react'

export default function HeroAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Form states
  const [badge, setBadge] = useState('')
  const [title1, setTitle1] = useState('')
  const [titleStroke, setTitleStroke] = useState('')
  const [title2, setTitle2] = useState('')
  const [description, setDescription] = useState('')
  const [primaryBtnText, setPrimaryBtnText] = useState('')
  const [primaryBtnUrl, setPrimaryBtnUrl] = useState('')
  const [secondaryBtnText, setSecondaryBtnText] = useState('')
  const [secondaryBtnUrl, setSecondaryBtnUrl] = useState('')
  const [speedCardTitle, setSpeedCardTitle] = useState('')
  const [speedCardValue, setSpeedCardValue] = useState('')
  const [speedCardSub, setSpeedCardSub] = useState('')
  const [roiCardTitle, setRoiCardTitle] = useState('')
  const [roiCardValue, setRoiCardValue] = useState('')
  const [ctrCardTitle, setCtrCardTitle] = useState('')
  const [ctrCardValue, setCtrCardValue] = useState('')
  const [ctrCardSub, setCtrCardSub] = useState('')

  useEffect(() => {
    fetchHeroData()
  }, [])

  async function fetchHeroData() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'hero_content')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data && data.value) {
        const val = data.value
        setBadge(val.badge || '')
        setTitle1(val.title_1 || '')
        setTitleStroke(val.title_stroke || '')
        setTitle2(val.title_2 || '')
        setDescription(val.description || '')
        setPrimaryBtnText(val.primary_btn_text || '')
        setPrimaryBtnUrl(val.primary_btn_url || '')
        setSecondaryBtnText(val.secondary_btn_text || '')
        setSecondaryBtnUrl(val.secondary_btn_url || '')
        setSpeedCardTitle(val.speed_card_title || '')
        setSpeedCardValue(val.speed_card_value || '')
        setSpeedCardSub(val.speed_card_sub || '')
        setRoiCardTitle(val.roi_card_title || '')
        setRoiCardValue(val.roi_card_value || '')
        setCtrCardTitle(val.ctr_card_title || '')
        setCtrCardValue(val.ctr_card_value || '')
        setCtrCardSub(val.ctr_card_sub || '')
      }
    } catch (err) {
      console.error('Error fetching hero data:', err)
      setErrorMsg('Failed to sync Hero parameters from Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Required fields validation
    if (!badge.trim()) errors.badge = 'Badge is required.'
    if (!title1.trim()) errors.title1 = 'Headline part 1 is required.'
    if (!titleStroke.trim()) errors.titleStroke = 'Stroke/Outline headline word is required.'
    if (!title2.trim()) errors.title2 = 'Headline part 2 is required.'
    if (!description.trim()) errors.description = 'Description is required.'
    if (!primaryBtnText.trim()) errors.primaryBtnText = 'Primary button text is required.'
    if (!primaryBtnUrl.trim()) errors.primaryBtnUrl = 'Primary button link is required.'

    // URL validations
    const urlPattern = /^(\/|https?:\/\/)/
    if (primaryBtnUrl && !urlPattern.test(primaryBtnUrl)) {
      errors.primaryBtnUrl = 'Must be an absolute URL (http/https) or relative path (e.g. /contact).'
    }
    if (secondaryBtnUrl && !urlPattern.test(secondaryBtnUrl)) {
      errors.secondaryBtnUrl = 'Must be an absolute URL (http/https) or relative path (e.g. /projects).'
    }

    // Character limits validation
    if (badge.length > 50) errors.badge = 'Badge must be less than 50 characters.'
    if (title1.length > 50) errors.title1 = 'Headline part 1 must be less than 50 characters.'
    if (titleStroke.length > 30) errors.titleStroke = 'Stroke word must be less than 30 characters.'
    if (title2.length > 50) errors.title2 = 'Headline part 2 must be less than 50 characters.'
    if (description.length > 400) errors.description = 'Description must be less than 400 characters.'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    if (!validateForm()) {
      setErrorMsg('Please correct the validation errors before saving.')
      return
    }

    setActionLoading(true)

    const payload = {
      key: 'hero_content',
      value: {
        badge,
        title_1: title1,
        title_stroke: titleStroke,
        title_2: title2,
        description,
        primary_btn_text: primaryBtnText,
        primary_btn_url: primaryBtnUrl,
        secondary_btn_text: secondaryBtnText,
        secondary_btn_url: secondaryBtnUrl,
        speed_card_title: speedCardTitle,
        speed_card_value: speedCardValue,
        speed_card_sub: speedCardSub,
        roi_card_title: roiCardTitle,
        roi_card_value: roiCardValue,
        ctr_card_title: ctrCardTitle,
        ctr_card_value: ctrCardValue,
        ctr_card_sub: ctrCardSub,
      },
      description: 'Homepage Hero section text and visual metrics parameters'
    }

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(payload)

      if (error) throw error

      setSuccessMsg('Hero content updated successfully in site_settings database.')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating Hero settings')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Sparkles className="h-4 w-4 text-[#ED3F27]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Aesthetic Gateways</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            Home Hero Editor
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Update headlines, descriptions, actions, and interactive marketing cards in real-time.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#ED3F27] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving Hero Content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Editor (Left) - Stacked on mobile, split on desktop */}
          <form onSubmit={handleSave} className="lg:col-span-6 space-y-6">
            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-4 flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Typography Section */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#ED3F27] font-bold border-b border-white/5 pb-2">
                Typography & Copy
              </h3>

              {/* Tagline Badge */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Tagline Badge
                </label>
                <input
                  type="text"
                  value={badge}
                      onFocus={() => setFocusedField('badge')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ED3F27]/50 transition-all font-mono"
                />
                {validationErrors.badge && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.badge}</p>
                )}
              </div>

              {/* Split Headline Titles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Headline Part 1
                  </label>
                  <input
                    type="text"
                    value={title1}
                      onFocus={() => setFocusedField('title1')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setTitle1(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                  />
                  {validationErrors.title1 && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.title1}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Headline Outline Word
                  </label>
                  <input
                    type="text"
                    value={titleStroke}
                      onFocus={() => setFocusedField('titleStroke')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setTitleStroke(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none font-bold"
                  />
                  {validationErrors.titleStroke && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.titleStroke}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Headline Part 2
                  </label>
                  <input
                    type="text"
                    value={title2}
                      onFocus={() => setFocusedField('title2')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setTitle2(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                  />
                  {validationErrors.title2 && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.title2}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                  Supporting Paragraph
                </label>
                <textarea
                  rows={4}
                  value={description}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none resize-none"
                />
                {validationErrors.description && (
                  <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.description}</p>
                )}
              </div>
            </div>

            {/* CTAs Section */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold border-b border-white/5 pb-2">
                Call To Actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={primaryBtnText}
                      onFocus={() => setFocusedField('primaryBtnText')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPrimaryBtnText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                  />
                  {validationErrors.primaryBtnText && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.primaryBtnText}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Primary Button URL / Path
                  </label>
                  <input
                    type="text"
                    value={primaryBtnUrl}
                      onFocus={() => setFocusedField('primaryBtnUrl')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPrimaryBtnUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none font-mono"
                  />
                  {validationErrors.primaryBtnUrl && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.primaryBtnUrl}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={secondaryBtnText}
                      onFocus={() => setFocusedField('secondaryBtnText')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setSecondaryBtnText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                    Secondary Button URL / Path
                  </label>
                  <input
                    type="text"
                    value={secondaryBtnUrl}
                      onFocus={() => setFocusedField('secondaryBtnUrl')}
                      onBlur={() => setFocusedField(null)}
                    onChange={(e) => setSecondaryBtnUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none font-mono"
                  />
                  {validationErrors.secondaryBtnUrl && (
                    <p className="text-red-400 text-[10px] font-mono mt-0.5">{validationErrors.secondaryBtnUrl}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Cards (Marketing cards) */}
            <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#BF5AF2] font-bold border-b border-white/5 pb-2">
                Floating Marketing Cards
              </h3>

              {/* Speed Card */}
              <div className="border border-white/5 p-4 rounded-xl space-y-3 bg-white/[0.005]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 font-mono">Card 1 (Speed Performance)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Title</label>
                    <input
                      type="text"
                      value={speedCardTitle}
                      onFocus={() => setFocusedField('speedCardTitle')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setSpeedCardTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Value</label>
                    <input
                      type="text"
                      value={speedCardValue}
                      onFocus={() => setFocusedField('speedCardValue')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setSpeedCardValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Sub-tag</label>
                    <input
                      type="text"
                      value={speedCardSub}
                      onFocus={() => setFocusedField('speedCardSub')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setSpeedCardSub(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ROI Card */}
              <div className="border border-white/5 p-4 rounded-xl space-y-3 bg-white/[0.005]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#ED3F27] font-mono">Card 2 (Campaign ROI)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Title</label>
                    <input
                      type="text"
                      value={roiCardTitle}
                      onFocus={() => setFocusedField('roiCardTitle')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRoiCardTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Value</label>
                    <input
                      type="text"
                      value={roiCardValue}
                      onFocus={() => setFocusedField('roiCardValue')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRoiCardValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CTR Card */}
              <div className="border border-white/5 p-4 rounded-xl space-y-3 bg-white/[0.005]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">Card 3 (Ads Click-Through)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Title</label>
                    <input
                      type="text"
                      value={ctrCardTitle}
                      onFocus={() => setFocusedField('ctrCardTitle')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setCtrCardTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Value</label>
                    <input
                      type="text"
                      value={ctrCardValue}
                      onFocus={() => setFocusedField('ctrCardValue')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setCtrCardValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Sub-tag</label>
                    <input
                      type="text"
                      value={ctrCardSub}
                      onFocus={() => setFocusedField('ctrCardSub')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setCtrCardSub(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={fetchHeroData}
                className="flex items-center gap-2 border border-white/10 bg-[#121212] hover:bg-white/10 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-[#ED3F27] hover:opacity-95 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg font-sans"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>

          {/* Live visual preview card (Right) - Stickied on desktop */}
          <div className="lg:col-span-6 lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                Live Desktop Frontend Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>

            <HeroPreview
              badge={badge}
              title_1={title1}
              title_stroke={titleStroke}
              title_2={title2}
              description={description}
              primary_btn_text={primaryBtnText}
              primary_btn_url={primaryBtnUrl}
              secondary_btn_text={secondaryBtnText}
              secondary_btn_url={secondaryBtnUrl}
              speed_card_title={speedCardTitle}
              speed_card_value={speedCardValue}
              speed_card_sub={speedCardSub}
              roi_card_title={roiCardTitle}
              roi_card_value={roiCardValue}
              ctr_card_title={ctrCardTitle}
              ctr_card_value={ctrCardValue}
              ctr_card_sub={ctrCardSub}
              focusedField={focusedField}
            />
          </div>

        </div>
      )}
    </div>
  )
}
