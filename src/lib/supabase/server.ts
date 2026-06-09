import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in Server Components, Server Actions, or Route Handlers.
 * Awaits cookies to read/write session state securely.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // Next.js prevents setting cookies during Server Component rendering.
            // This error can be ignored because middleware handles session refreshes.
          }
        },
      },
    }
  )
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates an administrative Supabase client using the service role key.
 * This client bypasses Row Level Security (RLS).
 * WARNING: NEVER use this in client components or expose it to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

