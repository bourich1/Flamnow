'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  BarChart3, 
  Activity, 
  Eye, 
  MousePointer, 
  CheckSquare, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  TrendingUp,
  Clock,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  ArrowUpRight,
  User
} from 'lucide-react'

interface AnalyticsEvent {
  id: string
  created_at: string
  session_id: string
  event_name: string
  page_path: string
  metadata: any
}

interface PathCount {
  path: string
  count: number
}

interface ReferrerCount {
  source: string
  count: number
}

export default function AnalyticsAdminPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Aggregate Stats
  const [totalViews, setTotalViews] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalSubmissions, setTotalSubmissions] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  
  // Breakdown Categories
  const [popularPaths, setPopularPaths] = useState<PathCount[]>([])
  const [deviceStats, setDeviceStats] = useState({ Desktop: 0, Mobile: 0, Tablet: 0 })
  const [topReferrers, setTopReferrers] = useState<ReferrerCount[]>([])
  const [recentLogs, setRecentLogs] = useState<AnalyticsEvent[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const logs = data || []
      setEvents(logs)
      
      // Calculate Stats
      let views = 0
      let clicks = 0
      let subs = 0
      const pathMap: Record<string, number> = {}
      const deviceMap = { Desktop: 0, Mobile: 0, Tablet: 0 }
      const referrerMap: Record<string, number> = {}
      const uniqueSessions = new Set<string>()

      logs.forEach(evt => {
        // 1. Count Unique Sessions
        if (evt.session_id) {
          uniqueSessions.add(evt.session_id)
        }

        // 2. Count Event Categories
        if (evt.event_name === 'page_view') views++
        else if (evt.event_name === 'element_click' || evt.event_name === 'click') clicks++
        else if (evt.event_name === 'form_submit') subs++

        // 3. Count Page Paths
        if (evt.page_path) {
          pathMap[evt.page_path] = (pathMap[evt.page_path] || 0) + 1
        }

        // 4. Parse browser / device / referrer metadata
        if (evt.metadata) {
          const meta = typeof evt.metadata === 'string' ? JSON.parse(evt.metadata) : evt.metadata
          
          // Count Device categories
          if (meta.device) {
            const dev = meta.device as 'Desktop' | 'Mobile' | 'Tablet'
            if (deviceMap[dev] !== undefined) {
              deviceMap[dev]++
            }
          }

          // Count Referrers
          if (meta.referrer) {
            let ref = meta.referrer
            if (ref === 'Direct') {
              ref = 'Direct Traffic'
            } else if (ref.includes('google')) {
              ref = 'Google'
            } else if (ref.includes('instagram')) {
              ref = 'Instagram'
            } else if (ref.includes('linkedin')) {
              ref = 'LinkedIn'
            } else if (ref.includes('twitter') || ref.includes('x.com')) {
              ref = 'Twitter/X'
            } else if (ref.includes('facebook')) {
              ref = 'Facebook'
            } else {
              try {
                const url = new URL(ref)
                ref = url.hostname.replace('www.', '')
              } catch {
                ref = ref.substring(0, 25)
              }
            }
            referrerMap[ref] = (referrerMap[ref] || 0) + 1
          }
        }
      })

      setTotalViews(views)
      setTotalClicks(clicks)
      setTotalSubmissions(subs)
      setUniqueVisitors(uniqueSessions.size)
      setDeviceStats(deviceMap)

      // Sort page paths
      const sortedPaths = Object.entries(pathMap)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      setPopularPaths(sortedPaths)

      // Sort referrers
      const sortedReferrers = Object.entries(referrerMap)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      setTopReferrers(sortedReferrers)

      // Get 10 most recent logs
      setRecentLogs(logs.slice(0, 10))

    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateEvents = async () => {
    setActionLoading(true)
    try {
      const paths = ['/', '/projects', '/services', '/about', '/contact', '/projects/volt-audio', '/projects/vortex-pay']
      const elements = ['hero-cta', 'navbar-about', 'service-branding-card', 'contact-submit-btn', 'footer-newsletter']
      const referrersList = ['Direct', 'https://google.com', 'https://instagram.com', 'https://linkedin.com', 'https://x.com', 'https://news.ycombinator.com']
      const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge']
      const devices = ['Desktop', 'Mobile', 'Tablet']
      
      const sessions = Array.from({ length: 8 }, () => 'sess_' + Math.random().toString(36).substring(2, 9))
      const dummyEvents = []
      
      for (let i = 0; i < 45; i++) {
        const eventType = Math.random() > 0.4 ? 'page_view' : (Math.random() > 0.25 ? 'element_click' : 'form_submit')
        const randomPath = paths[Math.floor(Math.random() * paths.length)]
        const randomSession = sessions[Math.floor(Math.random() * sessions.length)]
        const hoursAgo = Math.random() * 24
        
        let metadata: any = {
          device: devices[Math.floor(Math.random() * devices.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          referrer: referrersList[Math.floor(Math.random() * referrersList.length)]
        }

        if (eventType === 'element_click') {
          metadata.element_id = elements[Math.floor(Math.random() * elements.length)]
        } else if (eventType === 'form_submit') {
          metadata.form_id = 'contact_form'
        }

        dummyEvents.push({
          session_id: randomSession,
          event_name: eventType,
          page_path: randomPath,
          metadata: metadata,
          created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
        })
      }

      const { error } = await supabase
        .from('analytics_events')
        .insert(dummyEvents)

      if (error) throw error
      fetchAnalytics()
    } catch (err: any) {
      alert(err.message || 'Error simulating analytics events')
    } finally {
      setActionLoading(false)
    }
  }

  const totalDevices = deviceStats.Desktop + deviceStats.Mobile + deviceStats.Tablet

  return (
    <div className="space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-theme">
        <div>
          <div className="flex items-center gap-2 text-muted-text mb-1">
            <BarChart3 className="h-4 w-4 text-[#00E5FF]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Telemetry Monitor</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight font-display text-foreground">
            Client Traffic & Analytics
          </h2>
          <p className="text-xs text-muted-text mt-1">
            View interaction tracking logs, unique visitors, browser devices, and referral sources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            disabled={loading || actionLoading}
            className="flex items-center justify-center h-9 w-9 border border-border hover:border-white/20 bg-surface-base rounded-xl text-muted-text hover:text-foreground transition-all cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSimulateEvents}
            disabled={actionLoading}
            className="flex items-center gap-2 border border-[#00E5FF]/20 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 font-mono"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simulate Traffic</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center text-muted-text">
          <Loader2 className="h-8 w-8 animate-spin text-[#00E5FF] mb-2" />
          <p className="text-xs font-mono uppercase tracking-widest">Compiling telemetric dashboard...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-16 text-center bg-foreground/[0.005]">
          <Activity className="h-10 w-10 text-muted-text/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">No Telemetry Logs Found</h3>
          <p className="text-xs text-muted-text max-w-sm mx-auto mt-2">
            The analytics table is empty. Click below to inject a simulated batch of user session traces.
          </p>
          <button
            onClick={handleSimulateEvents}
            className="mt-6 flex items-center gap-2 border border-border hover:border-white/20 bg-surface-base px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 mx-auto cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#00E5FF]" />
            <span>Generate Mock Activity</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Visitor & Event Stats (Top Row Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1: Unique Visitors */}
            <div className="bg-surface-base border border-border-theme p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-border transition-all duration-300">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#00E5FF]/5 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">Unique Visitors</p>
                <User className="h-4 w-4 text-[#00E5FF]" />
              </div>
              <h3 className="text-3xl font-black mt-2 font-display text-foreground tracking-tight">{uniqueVisitors}</h3>
              <div className="mt-3 flex items-center gap-1 text-[9px] text-muted-text/50 font-mono uppercase">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>Session IDs traced</span>
              </div>
            </div>

            {/* Card 2: Total Page Views */}
            <div className="bg-surface-base border border-border-theme p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-border transition-all duration-300">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">Total Page Views</p>
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-3xl font-black mt-2 font-display text-foreground tracking-tight">{totalViews}</h3>
              <div className="mt-3 flex items-center gap-1 text-[9px] text-muted-text/50 font-mono uppercase">
                <span>avg {(totalViews / Math.max(1, uniqueVisitors)).toFixed(1)} views / sess</span>
              </div>
            </div>

            {/* Card 3: Button Clicks */}
            <div className="bg-surface-base border border-border-theme p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-border transition-all duration-300">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#FF9F0A]/5 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">Interactions / Clicks</p>
                <MousePointer className="h-4 w-4 text-[#FF9F0A]" />
              </div>
              <h3 className="text-3xl font-black mt-2 font-display text-foreground tracking-tight">{totalClicks}</h3>
              <div className="mt-3 w-full bg-white/[0.03] rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#FF9F0A]"
                  style={{ width: `${events.length > 0 ? (totalClicks / events.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Card 4: Form Conversions */}
            <div className="bg-surface-base border border-border-theme p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-border transition-all duration-300">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-[#BF5AF2]/5 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text font-mono">RFP Form Submissions</p>
                <CheckSquare className="h-4 w-4 text-[#BF5AF2]" />
              </div>
              <h3 className="text-3xl font-black mt-2 font-display text-foreground tracking-tight">{totalSubmissions}</h3>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                <span className="text-[#BF5AF2] font-bold">
                  {totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : 0}%
                </span>
                <span>conversion rate</span>
              </div>
            </div>
          </div>

          {/* Bento Grid: Devices, Top Pages, Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 1. Top Pages Leaderboard (lg:col-span-6) */}
            <section className="lg:col-span-6 bg-surface-base border border-border-theme p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-theme">
                <Compass className="h-4 w-4 text-[#00E5FF]" />
                <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                  Top Visited Pages
                </h3>
              </div>

              <div className="space-y-4">
                {popularPaths.map((item, idx) => {
                  const percentage = totalViews > 0 ? (item.count / totalViews) * 100 : 0
                  return (
                    <div key={item.path} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-muted-text/30 bg-surface-base h-5 w-5 rounded flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-muted-text truncate">{item.path}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-text font-bold bg-surface-base px-2.5 py-0.5 rounded">
                          {item.count} views
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-foreground/[0.02] h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00E5FF] to-[#BF5AF2] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 2. Device Breakdown (lg:col-span-6) */}
            <section className="lg:col-span-6 bg-surface-base border border-border-theme p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-theme">
                  <Laptop className="h-4 w-4 text-[#FF9F0A]" />
                  <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                    Device Categories
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Desktop */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-text">
                        <Laptop className="h-4 w-4 text-[#00E5FF]" />
                        <span>Desktop</span>
                      </div>
                      <span className="font-mono text-muted-text font-bold">
                        {deviceStats.Desktop} ({totalDevices > 0 ? ((deviceStats.Desktop / totalDevices) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-foreground/[0.02] h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00E5FF] rounded-full"
                        style={{ width: `${totalDevices > 0 ? (deviceStats.Desktop / totalDevices) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-text">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <span>Mobile</span>
                      </div>
                      <span className="font-mono text-muted-text font-bold">
                        {deviceStats.Mobile} ({totalDevices > 0 ? ((deviceStats.Mobile / totalDevices) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-foreground/[0.02] h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${totalDevices > 0 ? (deviceStats.Mobile / totalDevices) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-text">
                        <Tablet className="h-4 w-4 text-[#BF5AF2]" />
                        <span>Tablet</span>
                      </div>
                      <span className="font-mono text-muted-text font-bold">
                        {deviceStats.Tablet} ({totalDevices > 0 ? ((deviceStats.Tablet / totalDevices) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-foreground/[0.02] h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#BF5AF2] rounded-full"
                        style={{ width: `${totalDevices > 0 ? (deviceStats.Tablet / totalDevices) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 3. Top Referrers list (lg:col-span-5) */}
            <section className="lg:col-span-5 bg-surface-base border border-border-theme p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-theme">
                <Globe className="h-4 w-4 text-[#BF5AF2]" />
                <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                  Referral Channels
                </h3>
              </div>

              <div className="space-y-4">
                {topReferrers.length === 0 ? (
                  <p className="text-xs text-muted-text/50 font-mono">No referrer logs recorded yet.</p>
                ) : (
                  topReferrers.map((item) => (
                    <div key={item.source} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-2 w-2 rounded-full bg-[#BF5AF2]" />
                        <span className="font-mono text-muted-text truncate">{item.source}</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-text font-bold bg-surface-base px-2 py-0.5 rounded">
                        {item.count} sessions
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 4. Live Session Stream (lg:col-span-7) */}
            <section className="lg:col-span-7 bg-surface-base border border-border-theme p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-theme">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-wider font-display text-foreground">
                  Real-time Visitor Traces
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[9px] text-white/50">
                  <thead>
                    <tr className="border-b border-border-theme text-muted-text/50 uppercase">
                      <th className="pb-3 font-bold">Visit Date & Time</th>
                      <th className="pb-3 font-bold">Session ID</th>
                      <th className="pb-3 font-bold">Browser</th>
                      <th className="pb-3 font-bold">Device</th>
                      <th className="pb-3 font-bold">Path visited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {recentLogs.map((log) => {
                      const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata
                      return (
                        <tr key={log.id} className="hover:bg-foreground/[0.005] transition-colors">
                          <td className="py-3 text-muted-text">
                            {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} {new Date(log.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 text-[#00E5FF]/70">{log.session_id ? log.session_id.substring(0, 10) : 'anon'}</td>
                          <td className="py-3 text-muted-text">{meta.browser || 'Other'}</td>
                          <td className="py-3 text-muted-text">{meta.device || 'Desktop'}</td>
                          <td className="py-3 text-foreground/80">{log.page_path}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      )}
    </div>
  )
}
