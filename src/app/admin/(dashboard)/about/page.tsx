'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import FullAboutPreview from '@/components/admin/previews/FullAboutPreview'
import { 
  FileText, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle
} from 'lucide-react'

export default function AboutAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [narrativeTag, setNarrativeTag] = useState('Our Narrative')
  const [narrativeTitle, setNarrativeTitle] = useState('Fueling Category Leaders.')
  const [narrativeDesc1, setNarrativeDesc1] = useState('Flamnow was founded on a singular conviction: design is a product\'s primary business leverage. We fuse artistic direction with performant code to stoke brands that outscale the generic.')
  const [narrativeSubtitle, setNarrativeSubtitle] = useState('We only build things that burn indelibly.')
  const [narrativeDesc2, setNarrativeDesc2] = useState('The digital arena is crowded, noisy, and template-driven. Algorithms promote visual monotony, and platforms encourage brands to blend in. We built Flamnow to challenge this aesthetic decay. We do not do template layouts, stock layouts, or lukewarm ad copy.')
  const [narrativeDesc3, setNarrativeDesc3] = useState('We operate as a tight team of multidisciplinary creators: strategic researchers, high-fidelity developers, and CGI artists. By keeping our team integrated, we bypass corporate bloat and ship state-of-the-art products at speed.')

  const [missionTag, setMissionTag] = useState('Our Mission')
  const [missionTitle, setMissionTitle] = useState('To dismantle the generic, stoke visual authority, and make compromises obsolete.')

  const [philosophyTag, setPhilosophyTag] = useState('Core Philosophy')
  const [philosophyTitle, setPhilosophyTitle] = useState('What Stokes Us.')
  const [philosophyDesc, setPhilosophyDesc] = useState('Our decisions are guided by three values that ensure creativity maps to financial performance.')

  const [teamTag, setTeamTag] = useState('The Crew')
  const [teamTitle, setTeamTitle] = useState('Creative Athletes.')
  const [teamDesc, setTeamDesc] = useState('Meet the core minds stoking Flamnow\'s designs, codes, and attribution frameworks.')

  const [aboutValues, setAboutValues] = useState<any[]>([])

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
      
      if (error) throw error
      
      const configList = data || []
      configList.forEach(item => {
        if (item.key === 'about_values') {
          setAboutValues(item.value || [])
        } else if (item.key === 'about_page_content') {
          setNarrativeTag(item.value.narrativeTag || 'Our Narrative')
          setNarrativeTitle(item.value.narrativeTitle || '')
          setNarrativeDesc1(item.value.narrativeDesc1 || '')
          setNarrativeSubtitle(item.value.narrativeSubtitle || '')
          setNarrativeDesc2(item.value.narrativeDesc2 || '')
          setNarrativeDesc3(item.value.narrativeDesc3 || '')
          setMissionTag(item.value.missionTag || 'Our Mission')
          setMissionTitle(item.value.missionTitle || '')
          setPhilosophyTag(item.value.philosophyTag || 'Core Philosophy')
          setPhilosophyTitle(item.value.philosophyTitle || 'What Stokes Us.')
          setPhilosophyDesc(item.value.philosophyDesc || 'Our decisions are guided by three values that ensure creativity maps to financial performance.')
          setTeamTag(item.value.teamTag || 'The Crew')
          setTeamTitle(item.value.teamTitle || 'Creative Athletes.')
          setTeamDesc(item.value.teamDesc || 'Meet the core minds stoking Flamnow\'s designs, codes, and attribution frameworks.')
        }
      })

      if (!configList.some(i => i.key === 'about_values')) {
        setAboutValues([
          { iconName: 'Compass', title: '', desc: '' },
          { iconName: 'Zap', title: '', desc: '' },
          { iconName: 'HeartHandshake', title: '', desc: '' }
        ])
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      setErrorMsg('Failed to sync about info from database.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    setActionLoading(true)

    const payloadValues = {
      key: 'about_values',
      value: aboutValues,
      description: 'Core philosophy values shown on About'
    }

    const payloadContent = {
      key: 'about_page_content',
      value: { 
        narrativeTag, narrativeTitle, narrativeDesc1, narrativeSubtitle, narrativeDesc2, narrativeDesc3, 
        missionTag, missionTitle,
        philosophyTag, philosophyTitle, philosophyDesc,
        teamTag, teamTitle, teamDesc
      },
      description: 'About page narratives, mission, and section headers'
    }

    try {
      const { error: err1 } = await supabase.from('site_settings').upsert(payloadValues)
      const { error: err2 } = await supabase.from('site_settings').upsert(payloadContent)

      if (err1 || err2) throw err1 || err2

      setSuccessMsg('About page updated successfully.')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating about page')
    } finally {
      setActionLoading(false)
    }
  }

  const updateAboutValue = (idx: number, field: string, val: string) => {
    const updated = [...aboutValues]
    updated[idx] = { ...updated[idx], [field]: val }
    setAboutValues(updated)
  }

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <FileText className="h-4 w-4 text-[#ED3F27]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Page Content</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            About Page
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Manage the narratives, mission, and philosophy values on the About page.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-[#ED3F27] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Retrieving content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <form onSubmit={handleSave} className="space-y-6">
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-4 flex items-start gap-2.5 font-sans">
                  <Check className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex items-start gap-2.5 font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Narrative Section</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Tag / Subtitle</label>
                    <input
                      type="text"
                      value={narrativeTag}
                      onChange={(e) => setNarrativeTag(e.target.value)}
                      onFocus={() => setFocusedField('narrativeTag')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Main Title</label>
                    <input
                      type="text"
                      value={narrativeTitle}
                      onChange={(e) => setNarrativeTitle(e.target.value)}
                      onFocus={() => setFocusedField('narrativeTitle')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Main Description</label>
                    <textarea
                      rows={3}
                      value={narrativeDesc1}
                      onChange={(e) => setNarrativeDesc1(e.target.value)}
                      onFocus={() => setFocusedField('narrativeDesc1')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1 pt-4">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Subtitle</label>
                    <input
                      type="text"
                      value={narrativeSubtitle}
                      onChange={(e) => setNarrativeSubtitle(e.target.value)}
                      onFocus={() => setFocusedField('narrativeSubtitle')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Secondary Description (Paragraph 1)</label>
                    <textarea
                      rows={4}
                      value={narrativeDesc2}
                      onChange={(e) => setNarrativeDesc2(e.target.value)}
                      onFocus={() => setFocusedField('narrativeDesc2')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Secondary Description (Paragraph 2)</label>
                    <textarea
                      rows={4}
                      value={narrativeDesc3}
                      onChange={(e) => setNarrativeDesc3(e.target.value)}
                      onFocus={() => setFocusedField('narrativeDesc3')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Mission Section</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Tag / Subtitle</label>
                    <input
                      type="text"
                      value={missionTag}
                      onChange={(e) => setMissionTag(e.target.value)}
                      onFocus={() => setFocusedField('missionTag')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Mission Statement</label>
                    <textarea
                      rows={3}
                      value={missionTitle}
                      onChange={(e) => setMissionTitle(e.target.value)}
                      onFocus={() => setFocusedField('missionTitle')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Philosophy Section Headers</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Tag / Subtitle</label>
                      <input
                        type="text"
                        value={philosophyTag}
                        onChange={(e) => setPhilosophyTag(e.target.value)}
                        onFocus={() => setFocusedField('philosophyTag')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Main Title</label>
                      <input
                        type="text"
                        value={philosophyTitle}
                        onChange={(e) => setPhilosophyTitle(e.target.value)}
                        onFocus={() => setFocusedField('philosophyTitle')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Description</label>
                    <textarea
                      rows={2}
                      value={philosophyDesc}
                      onChange={(e) => setPhilosophyDesc(e.target.value)}
                      onFocus={() => setFocusedField('philosophyDesc')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Team Section Headers</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Tag / Subtitle</label>
                      <input
                        type="text"
                        value={teamTag}
                        onChange={(e) => setTeamTag(e.target.value)}
                        onFocus={() => setFocusedField('teamTag')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Main Title</label>
                      <input
                        type="text"
                        value={teamTitle}
                        onChange={(e) => setTeamTitle(e.target.value)}
                        onFocus={() => setFocusedField('teamTitle')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Description</label>
                    <textarea
                      rows={2}
                      value={teamDesc}
                      onChange={(e) => setTeamDesc(e.target.value)}
                      onFocus={() => setFocusedField('teamDesc')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#0b0b0b] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Core Philosophy Values (Cards)</h3>
                <div className="space-y-6">
                  {aboutValues.map((val, idx) => (
                    <div key={idx} className="bg-[#0b0b0b] border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex gap-4">
                        <div className="w-1/3 space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Icon Name</label>
                          <input
                            type="text"
                            value={val.iconName}
                            onChange={(e) => updateAboutValue(idx, 'iconName', e.target.value)}
                            onFocus={() => setFocusedField(`value_${idx}_iconName`)}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#121212] text-[10px] text-white focus:outline-none focus:border-[#ED3F27]/50"
                          />
                        </div>
                        <div className="w-2/3 space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Value Title</label>
                          <input
                            type="text"
                            value={val.title}
                            onChange={(e) => updateAboutValue(idx, 'title', e.target.value)}
                            onFocus={() => setFocusedField(`value_${idx}_title`)}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#121212] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/60 block font-mono">Description</label>
                        <textarea
                          rows={2}
                          value={val.desc}
                          onChange={(e) => updateAboutValue(idx, 'desc', e.target.value)}
                          onFocus={() => setFocusedField(`value_${idx}_desc`)}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#121212] text-xs text-white focus:outline-none focus:border-[#ED3F27]/50 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF9F0A] to-[#ED3F27] hover:opacity-95 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 font-sans"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save About Content</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                Live Page Preview
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Real-time
              </span>
            </div>
            <div className="transform origin-top w-full">
              <FullAboutPreview 
                narrativeTag={narrativeTag}
                narrativeTitle={narrativeTitle}
                narrativeDesc1={narrativeDesc1}
                narrativeSubtitle={narrativeSubtitle}
                narrativeDesc2={narrativeDesc2}
                narrativeDesc3={narrativeDesc3}
                missionTag={missionTag}
                missionTitle={missionTitle}
                philosophyTag={philosophyTag}
                philosophyTitle={philosophyTitle}
                philosophyDesc={philosophyDesc}
                teamTag={teamTag}
                teamTitle={teamTitle}
                teamDesc={teamDesc}
                aboutValues={aboutValues}
                focusedField={focusedField}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
