import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Determine where to redirect the user after verification (defaults to home page)
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Prevent open redirect vulnerabilities by redirecting to relative paths
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  // Redirect to an error page if auth code exchange fails
  const errorUrl = new URL('/auth/auth-code-error', origin)
  return NextResponse.redirect(errorUrl.toString())
}
