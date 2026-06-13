'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitTestimonialReview(formData: FormData) {
  const honeypot = formData.get('website')
  if (honeypot) {
    return { error: 'Spam detected.' }
  }

  const fullName = formData.get('fullName') as string
  const company = formData.get('company') as string
  const position = formData.get('position') as string
  const rating = Number(formData.get('rating'))
  const message = formData.get('message') as string
  const image = formData.get('image') as File | null

  if (!fullName || !message || !rating || rating < 1 || rating > 5) {
    return { error: 'Please fill in all required fields properly.' }
  }

  const supabase = await createClient()
  let imageUrl = null

  if (image && image.size > 0) {
    // Basic image validation
    if (!image.type.startsWith('image/')) {
      return { error: 'Invalid file type. Please upload an image.' }
    }
    if (image.size > 5 * 1024 * 1024) {
      return { error: 'Image size should be less than 5MB.' }
    }

    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('testimonial-submissions')
      .upload(`public/${fileName}`, image)

    if (uploadError) {
      return { error: 'Failed to upload image.' }
    }

    const { data: publicUrlData } = supabase.storage
      .from('testimonial-submissions')
      .getPublicUrl(`public/${fileName}`)
      
    imageUrl = publicUrlData.publicUrl
  }

  // Insert into pending_testimonials
  const { error: insertError } = await supabase.from('pending_testimonials').insert({
    full_name: fullName.trim(),
    company: company?.trim() || null,
    position: position?.trim() || null,
    rating,
    message: message.trim(),
    image_url: imageUrl,
    status: 'pending'
  })

  if (insertError) {
    console.error('Testimonial submission error:', insertError)
    return { error: 'Failed to submit review. Please try again later.' }
  }

  return { success: true }
}
