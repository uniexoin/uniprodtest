import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { data: raw, error } = await supabaseAdmin.from('profiles').select('*, vendor_profiles(*)').eq('role', 'vendor');
    if (error) throw error;
    
    const formatBusinessType = (type: string) => {
      if (!type) return 'Unknown';
      const t = type.toLowerCase();
      if (t === 'house' || t === 'room') return 'PG/Rooms';
      if (t === 'vehicle' || t === 'bike' || t === 'car') return 'Car/Bike Rental';
      if (t === 'laundry') return 'Laundry Services';
      return type;
    };

    const mapped = raw.map(p => {
      const vp = Array.isArray(p.vendor_profiles)
        ? p.vendor_profiles[0]
        : (p.vendor_profiles || {});

      return {
        _id: p.id,
        businessName: vp?.business_name || p.business_name || p.name,
        businessType: formatBusinessType(vp?.service_type || p.service_type),
        businessPhone: vp?.business_phone || p.phone,
        businessAddress: vp?.business_address,
        approvalStatus: p.kyc_status || 'pending',
        createdAt: p.created_at,
        userId: {
          _id: p.id,
          name: p.name,
          email: p.email
        }
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});