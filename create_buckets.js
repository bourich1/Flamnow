const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load env variables from .env
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.error('Failed to parse .env file manually:', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or Service Role Key in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const bucketsToCreate = [
  'brand-assets',
  'project-images',
  'client-logos',
  'team-avatars',
  'testimonial-avatars'
];

async function setupBuckets() {
  console.log('Fetching existing storage buckets...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    process.exit(1);
  }

  const existingNames = buckets.map(b => b.name);
  console.log('Existing buckets:', existingNames);

  for (const bucketName of bucketsToCreate) {
    if (existingNames.includes(bucketName)) {
      console.log(`Bucket "${bucketName}" already exists.`);
      continue;
    }

    console.log(`Creating bucket "${bucketName}"...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true, // Make files public so they can be accessed via URL
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp', 'image/jpg'],
      fileSizeLimit: 10485760 // 10MB limit
    });

    if (error) {
      console.error(`Failed to create bucket "${bucketName}":`, error.message);
    } else {
      console.log(`Successfully created bucket "${bucketName}".`);
    }
  }

  console.log('Storage bucket setup complete.');
}

setupBuckets();
