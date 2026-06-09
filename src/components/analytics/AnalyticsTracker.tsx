'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Helper to extract browser name from userAgent
function getBrowserName(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  if (ua.includes('Trident') || ua.includes('MSIE')) return 'Internet Explorer'
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  return 'Other'
}

// Helper to extract device category
function getDeviceCategory(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const trackPageView = async () => {
      // 1. Bypass tracking for administrative dashboard pages
      if (pathname?.startsWith('/admin')) return

      try {
        // 2. Generate/fetch visitor session ID
        let sessionId = sessionStorage.getItem('flamnow_session_id')
        if (!sessionId) {
          sessionId = 'sess_' + Math.random().toString(36).substring(2, 15)
          sessionStorage.setItem('flamnow_session_id', sessionId)
        }

        // 3. Collect client-side metadata
        const ua = navigator.userAgent
        const browser = getBrowserName(ua)
        const device = getDeviceCategory(ua)
        const referrer = document.referrer || 'Direct'
        const queryStr = window.location.search
        const pagePath = pathname + queryStr

        // 4. Log page view event in Supabase
        await supabase.from('analytics_events').insert([
          {
            session_id: sessionId,
            event_name: 'page_view',
            page_path: pagePath,
            metadata: {
              referrer,
              device,
              browser,
              userAgent: ua
            }
          }
        ])
      } catch (err) {
        console.error('Failed to log page view trace:', err)
      }
    }

    trackPageView()
  }, [pathname, supabase])

  return null
}
