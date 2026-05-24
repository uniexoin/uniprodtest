import fs from 'fs';
import path from 'path';

const API_DIR = 'c:/lpuc2/src/app/api';

const files = {
  'admin/dashboard/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const [usersCount, vendorsCount, bookingsCount, rev] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'vendor'),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('total_amount').eq('status', 'completed')
    ]);
    
    const totalRevenue = (rev.data || []).reduce((sum, b) => sum + (b.total_amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: usersCount.count || 0,
        totalVendors: vendorsCount.count || 0,
        totalBookings: bookingsCount.count || 0,
        totalRevenue,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'admin/users/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    let query = supabaseAdmin.from('profiles').select('*');
    if (role && role !== 'all') query = query.eq('role', role);
    if (search) query = query.ilike('name', \`%\${search}%\`);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json({ success: true, data: { data } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'admin/users/[id]/suspend/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const PATCH = withAuth(async (req, user, context) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { id } = context.params;
    const { suspended } = await req.json();
    
    const { error } = await supabaseAdmin.from('profiles').update({ is_suspended: suspended }).eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'vendors/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*, vendor_profiles(*)').eq('role', 'vendor');
    if (error) throw error;
    return NextResponse.json({ success: true, data: { data } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'vendors/[id]/approval/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const PATCH = withAuth(async (req, user, context) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { id } = context.params;
    const { status } = await req.json();
    
    const { error } = await supabaseAdmin.from('profiles').update({ kyc_status: status }).eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'admin/transactions/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { data, error } = await supabaseAdmin.from('payments').select('*, bookings(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data: { data } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'payments/route.ts': `
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { data, error } = await supabaseAdmin.from('payments').select('*, bookings(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data: { data } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
  `,
  'admin/reports/route.ts': `
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, data: { data: [] } });
}
  `,
  'admin/settings/route.ts': `
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}
  `,
  'admin/rank/[category]/route.ts': `
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}
  `
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(API_DIR, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}

console.log('Admin routes built successfully.');
