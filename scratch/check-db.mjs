import { createClient } from '@supabase/supabase-js';

const url = 'https://ydzdnmxbcuiptwfzhyml.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkemRubXhiY3VpcHR3ZnpoeW1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc4Njc1MiwiZXhwIjoyMDkzMzYyNzUyfQ.nX9eh6oWht19QNRL7GVAkiGUity_7TmK3D37qAyAG74';

const supabase = createClient(url, key);

async function check() {
  try {
    const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: b } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    const { count: p } = await supabase.from('payments').select('*', { count: 'exact', head: true });
    const { data: profiles } = await supabase.from('profiles').select('role').limit(20);

    console.log('Database Check:');
    console.log('Total Profiles:', u);
    console.log('Total Bookings:', b);
    console.log('Total Payments:', p);
    console.log('Profile roles:', profiles);
  } catch (e) {
    console.error(e);
  }
}

check();
