const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
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
  console.error('Failed to parse .env file:', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function verifyWorkflow() {
  console.log('=== VERIFYING CONTACT MESSAGES WORKFLOW ===\n');

  // 1. Create a test message
  console.log('Step 1: Creating a test message...');
  const testEmail = `workflow-test-${Date.now()}@example.com`;
  const { data: inserted, error: insertErr } = await supabase
    .from('contact_messages')
    .insert({
      name: 'Workflow Tester',
      email: testEmail,
      message: 'This is a test message to verify the complete status flow.'
    })
    .select();

  if (insertErr || !inserted || inserted.length === 0) {
    console.error('❌ Step 1 Failed: Could not create test message', insertErr);
    process.exit(1);
  }
  const msg = inserted[0];
  console.log(`✅ Test message created with ID: ${msg.id}`);

  // 2. Confirm it is saved in Supabase
  console.log('\nStep 2: Confirming it is saved in Supabase...');
  const { data: fetchSaved, error: fetchErr } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', msg.id)
    .single();

  if (fetchErr || !fetchSaved) {
    console.error('❌ Step 2 Failed: Message not found in Supabase', fetchErr);
    process.exit(1);
  }
  console.log(`✅ Saved successfully in Supabase (Found record: ${fetchSaved.id})`);

  // 3. Confirm status defaults to 'new'
  console.log('\nStep 3: Confirming status defaults to "new"...');
  console.log(`Saved message status: "${fetchSaved.status}"`);
  if (fetchSaved.status === 'new') {
    console.log('✅ Status successfully defaulted to "new"');
  } else {
    console.error(`❌ Step 3 Failed: Expected status "new", got "${fetchSaved.status}"`);
    process.exit(1);
  }

  // 4. Change status to 'read'
  console.log('\nStep 4: Changing status to "read"...');
  const { error: updateReadErr } = await supabase
    .from('contact_messages')
    .update({ status: 'read' })
    .eq('id', msg.id);

  if (updateReadErr) {
    console.error('❌ Step 4 Failed: Could not update status to "read"', updateReadErr);
    process.exit(1);
  }
  console.log('✅ Status update to "read" requested.');

  // 5 & 6. Refresh and confirm persistence
  console.log('\nSteps 5 & 6: Refreshing details and confirming "read" status persists...');
  const { data: refreshedRead, error: refreshReadErr } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', msg.id)
    .single();

  if (refreshReadErr || !refreshedRead) {
    console.error('❌ Step 5/6 Failed: Could not fetch refreshed details', refreshReadErr);
    process.exit(1);
  }
  console.log(`Refreshed message status: "${refreshedRead.status}"`);
  if (refreshedRead.status === 'read') {
    console.log('✅ Read status persists successfully.');
  } else {
    console.error(`❌ Step 5/6 Failed: Expected "read", got "${refreshedRead.status}"`);
    process.exit(1);
  }

  // 7. Change status to 'replied'
  console.log('\nStep 7: Changing status to "replied"...');
  const { error: updateRepliedErr } = await supabase
    .from('contact_messages')
    .update({ status: 'replied' })
    .eq('id', msg.id);

  if (updateRepliedErr) {
    console.error('❌ Step 7 Failed: Could not update status to "replied"', updateRepliedErr);
    process.exit(1);
  }
  console.log('✅ Status update to "replied" requested.');

  // 8 & 9. Refresh and confirm persistence
  console.log('\nSteps 8 & 9: Refreshing details and confirming "replied" status persists...');
  const { data: refreshedReplied, error: refreshRepliedErr } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', msg.id)
    .single();

  if (refreshRepliedErr || !refreshedReplied) {
    console.error('❌ Step 8/9 Failed: Could not fetch refreshed details', refreshRepliedErr);
    process.exit(1);
  }
  console.log(`Refreshed message status: "${refreshedReplied.status}"`);
  if (refreshedReplied.status === 'replied') {
    console.log('✅ Replied status persists successfully.');
  } else {
    console.error(`❌ Step 8/9 Failed: Expected "replied", got "${refreshedReplied.status}"`);
    process.exit(1);
  }

  // Cleanup: delete the test message
  console.log('\nCleaning up: deleting the test message...');
  await supabase.from('contact_messages').delete().eq('id', msg.id);
  console.log('✅ Cleanup finished.');

  console.log('\n🎉 ALL WORKFLOW STEPS PASSED SUCCESSFULLY!');
}

verifyWorkflow().catch(console.error);
