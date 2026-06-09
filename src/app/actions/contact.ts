'use server'

import { createClient } from '@/lib/supabase/server'

interface ContactSubmission {
  name: string
  email: string
  phone: string
  company: string
  services: string[]
  budget: string
  message: string
  website?: string // Honeypot field
  clientLoadTime?: number // Time-based submission check
}

/**
 * Basic HTML sanitization to prevent Stored XSS inside the admin dashboard.
 */
function sanitize(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Server Action to handle the contact form submissions with spam protection and input validation.
 */
export async function submitContactForm(data: ContactSubmission) {
  // 1. Honeypot Spam Protection
  // If the hidden 'website' field is filled, it's a bot.
  // Silently return success: true to trick the bot without saving spam to the database.
  if (data.website && data.website.trim() !== '') {
    console.warn('Spam submission blocked via Honeypot field (website was filled).')
    return { success: true }
  }

  // 2. Fast-Submission Spam Protection (Timestamp check)
  // If the form is submitted within 2.5 seconds of page load, it's likely automated.
  if (data.clientLoadTime && Date.now() - data.clientLoadTime < 2500) {
    console.warn('Spam submission blocked via fast-submission detection.')
    return { error: 'Form submitted too quickly. Please wait and try again.' }
  }

  // 3. Input Validation
  const name = sanitize(data.name)
  const email = sanitize(data.email)
  const phone = sanitize(data.phone)
  const company = sanitize(data.company)
  const message = sanitize(data.message)
  const budget = sanitize(data.budget)
  const services = (data.services || []).map(s => sanitize(s))

  if (!name || !email || !message) {
    return { error: 'Name, email, and message description are required.' }
  }

  // Email validation regex (RFC 5322)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!emailRegex.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  // Basic phone format validation if phone is provided
  if (phone && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phone)) {
    return { error: 'Please enter a valid phone number format.' }
  }

  try {
    const supabase = await createClient()

    // Insert into the database
    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        phone,
        company,
        services,
        budget,
        message,
        status: 'new' // Explicitly set status to default
      },
    ])

    if (error) {
      console.error('Supabase DB Error:', error)
      return { error: `Failed to save submission: ${error.message}` }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected contact form action error:', err)
    return { error: 'An unexpected server error occurred. Please try again.' }
  }
}
