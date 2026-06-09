import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the user's session in the middleware.
 * This ensures that the user's session remains active and secure,
 * and updates cookies correctly on both the request and response.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies for downstream Server Components
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Re-create the response object with updated request cookies
          response = NextResponse.next({
            request,
          })
          
          // Set the cookies on the response headers to send back to the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // SECURE AUTH CHECK: Always use getUser() instead of getSession()
  // getUser() validates the token with the Supabase Auth server, preventing JWT spoofing.
  const { data: { user } } = await supabase.auth.getUser()

  const isBaseAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  // Route Protection Rules:
  if (isBaseAdminRoute) {
    if (isLoginRoute) {
      // If already logged in as admin, redirect to admin dashboard
      if (user) {
        const { data: admin } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .single()

        if (admin) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        }
      }
    } else {
      // If not logged in, redirect to login page
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }

      // Verify admin role authorization in the database table
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      if (adminError || !admin) {
        // Sign out immediately and redirect back to login if they are not in the admin table
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}
