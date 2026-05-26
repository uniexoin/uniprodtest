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

console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  try {
    // 1. Query profiles table
    const { data: profiles, error: pError } = await supabase.from('profiles').select('id, role, name, email');
    if (pError) console.error('Profiles error:', pError);
    else {
      console.log('Total profiles count:', profiles.length);
      console.log('Roles distribution:', profiles.reduce((acc, p) => {
        acc[p.role] = (acc[p.role] || 0) + 1;
        return acc;
      }, {}));
      console.log('Sample profiles:', profiles.slice(0, 5));
    }

    // 2. Query vendor_profiles table
    const { data: vendors, error: vError } = await supabase.from('vendor_profiles').select('*');
    if (vError) console.error('Vendors error:', vError);
    else {
      console.log('Total vendor profiles count:', vendors.length);
      console.log('Service types distribution:', vendors.reduce((acc, v) => {
        acc[v.service_type] = (acc[v.service_type] || 0) + 1;
        return acc;
      }, {}));
      console.log('Sample vendors:', vendors.slice(0, 5));
    }
  } catch (err) {
    console.error('Error running query:', err);
  }
}

run();
