const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    envVars[key] = val;
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  try {
    const [usersCount, vendorsCount, bookingsCount, rev, recentB, recentP] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'vendor'),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('total_amount').eq('status', 'completed'),
      supabaseAdmin.from('bookings').select('*, userId:profiles!user_id(id, name, email, phone), vendorId:profiles!vendor_id(id, name, email, phone)').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('payments').select('*, userId:profiles!user_id(id, name, email, phone)').order('created_at', { ascending: false }).limit(5)
    ]);

    console.log('usersCount:', usersCount);
    console.log('vendorsCount:', vendorsCount);
    console.log('bookingsCount:', bookingsCount);
    console.log('rev:', rev);
    console.log('recentB error:', recentB.error);
    console.log('recentP error:', recentP.error);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
