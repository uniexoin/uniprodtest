import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { data: raw, error } = await supabaseAdmin.from('profiles').select('*, vendor_profiles(*)').eq('role', 'vendor');
    if (error) throw error;
    
    const mapped = raw.map(p => ({
      _id: p.id,
      businessName: p.vendor_profiles?.[0]?.business_name || p.name,
      businessType: p.vendor_profiles?.[0]?.business_type || 'Unknown',
      businessPhone: p.vendor_profiles?.[0]?.business_phone || p.phone,
      businessAddress: p.vendor_profiles?.[0]?.business_address,
      approvalStatus: p.kyc_status || 'pending',
      createdAt: p.created_at,
      userId: {
        _id: p.id,
        name: p.name,
        email: p.email
      }
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});