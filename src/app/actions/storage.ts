'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * Helper to verify if the current user is authenticated.
 */
async function verifyAdminAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized: Authentication required.')
  }
  
  // Verify if the user is in public.admins
  const { data: adminRecord, error: adminError } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .single()

  if (adminError || !adminRecord) {
    throw new Error('Unauthorized: Admin privilege required.')
  }

  return user
}

/**
 * Server Action to list files in a bucket.
 */
export async function listBucketFiles(bucketName: string) {
  try {
    await verifyAdminAuth()

    const adminClient = createAdminClient()
    const { data, error } = await adminClient.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error(`Error listing bucket ${bucketName}:`, error)
      return { error: error.message }
    }

    // Map files to include their public URLs
    const filesWithUrls = data.map(file => {
      const { data: { publicUrl } } = adminClient.storage
        .from(bucketName)
        .getPublicUrl(file.name)

      return {
        ...file,
        publicUrl
      }
    })

    return { success: true, files: filesWithUrls }
  } catch (err: any) {
    console.error('listBucketFiles error:', err)
    return { error: err.message || 'An error occurred while listing files.' }
  }
}

/**
 * Server Action to upload a file to a bucket.
 */
export async function uploadFile(formData: FormData) {
  try {
    await verifyAdminAuth()

    const file = formData.get('file') as File
    const bucketName = formData.get('bucket') as string

    if (!file) {
      return { error: 'No file provided in the request.' }
    }

    if (!bucketName) {
      return { error: 'Target bucket name is required.' }
    }

    // Sanitize and create a unique filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `${Date.now()}_${cleanFileName}`

    const adminClient = createAdminClient()
    
    // Convert File to ArrayBuffer for uploading
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await adminClient.storage
      .from(bucketName)
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error(`Error uploading file to ${bucketName}:`, error)
      return { error: error.message }
    }

    const { data: { publicUrl } } = adminClient.storage
      .from(bucketName)
      .getPublicUrl(uniqueFileName)

    return {
      success: true,
      fileName: uniqueFileName,
      publicUrl
    }
  } catch (err: any) {
    console.error('uploadFile error:', err)
    return { error: err.message || 'An error occurred during file upload.' }
  }
}

/**
 * Server Action to delete a file from a bucket.
 */
export async function deleteFile(bucketName: string, fileName: string) {
  try {
    await verifyAdminAuth()

    if (!bucketName || !fileName) {
      return { error: 'Bucket name and file name are required.' }
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient.storage
      .from(bucketName)
      .remove([fileName])

    if (error) {
      console.error(`Error deleting file ${fileName} from ${bucketName}:`, error)
      return { error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('deleteFile error:', err)
    return { error: err.message || 'An error occurred during file deletion.' }
  }
}
