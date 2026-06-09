const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const args = process.argv.slice(2);
const searchEmail = args[0];

if (!searchEmail) {
  console.log('\nUsage:');
  console.log('  node --env-file=.env link-admin.js <user-email>\n');
  process.exit(1);
}

async function linkUserToAdmins() {
  console.log(`Searching for authenticated user: ${searchEmail}...`);

  // 1. Find user details using Supabase Admin Auth API
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError.message);
    process.exit(1);
  }

  const targetUser = usersData.users.find(u => u.email?.toLowerCase() === searchEmail.toLowerCase());

  if (!targetUser) {
    console.error(`Error: No user found in Supabase Auth with email "${searchEmail}".`);
    console.log('Please register the user first or verify spelling.');
    process.exit(1);
  }

  const userId = targetUser.id;
  console.log(`Found User ID: ${userId}`);

  // 2. Insert into the public.admins table
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .insert([
      {
        id: userId,
        email: targetUser.email
      }
    ])
    .select();

  if (adminError) {
    if (adminError.code === '23505') {
      console.log(`\nNotice: User "${searchEmail}" is already linked to the admins table.`);
    } else {
      console.error('Database Insertion Error:', adminError.message);
    }
    process.exit(1);
  }

  console.log(`\nSUCCESS: User "${searchEmail}" is now linked to public.admins table!`);
  console.log('They can now log in to the admin panel.\n');
}

linkUserToAdmins();
