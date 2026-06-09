const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Service role client bypasses RLS and handles admin auth management
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

if (!email || !password) {
  console.log('\nUsage:');
  console.log('  node --env-file=.env create-admin.js <email> <password>\n');
  process.exit(1);
}

async function createAdminUser() {
  console.log(`Attempting to create admin account: ${email}...`);

  // 1. Create the user in Supabase Auth using the admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  });

  if (authError) {
    console.error('Authentication Error:', authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  console.log(`Auth user successfully created. User ID: ${userId}`);

  // 2. Insert user into the public.admins table to grant console privileges
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .insert([
      {
        id: userId,
        email: email
      }
    ])
    .select();

  if (adminError) {
    console.error('Database Registration Error:', adminError.message);
    console.log('\nRollback: Deleting auth user...');
    await supabase.auth.admin.deleteUser(userId);
    process.exit(1);
  }

  console.log('\nSUCCESS: Admin account created successfully!');
  console.log('You can now log in at /admin/login with:');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}\n`);
}

createAdminUser();
