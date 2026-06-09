'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Server Action to sign in an administrator.
 * Validates admin status against the public.admins table after login.
 */
export async function signInAdmin(email: string, password: string) {
  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const supabase = await createClient()

    // 1. Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    const userId = data.user?.id
    if (!userId) {
      return { error: 'Authentication failed. User session could not be established.' }
    }

    // 2. Validate that the user exists in the public.admins table
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .single()

    if (adminError || !admin) {
      // Immediately revoke session if they are not a registered administrator
      await supabase.auth.signOut()
      return { error: 'Access Denied: You are not authorized as an administrator.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Admin login Server Action error:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Server Action to log out the administrator and clear session cookies.
 */
export async function signOutAdmin() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return { success: true }
  } catch (err) {
    console.error('Sign out error:', err)
    return { error: 'Failed to sign out.' }
  }
}
