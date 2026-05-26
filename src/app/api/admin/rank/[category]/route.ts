import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

// GET all vendors in a category
export const GET = withAuth(async (req: Request, user: any, context: any) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const category = context?.params?.category;
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category required' }, { status: 400 });
    }

    const { data: raw, error } = await supabaseAdmin
      .from('vendor_profiles')
      .select('*, profiles!user_id(*)')
      .eq('service_type', category.toUpperCase());

    if (error) {
      console.error('[API ADMIN RANK GET] Supabase error:', error);
      throw error;
    }

    const mapped = (raw || []).map((vp: any) => ({
      _id: vp.id,
      rank: vp.rank || 0,
      businessName: vp.business_name,
      approvalStatus: vp.approval_status,
      businessPhone: vp.business_phone,
      businessAddress: vp.business_address,
      createdAt: vp.created_at,
      userId: {
        _id: vp.profiles?.id,
        name: vp.profiles?.name,
        email: vp.profiles?.email,
        phone: vp.profiles?.phone,
      }
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error('[API ADMIN RANK GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}, 'admin');

// PATCH rank of a vendor (the dynamic parameter context.params.category will be the vendor profile ID)
export const PATCH = withAuth(async (req: Request, user: any, context: any) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const id = context?.params?.category;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Vendor profile ID required' }, { status: 400 });
    }

    const { rank } = await req.json();
    if (rank === undefined || typeof rank !== 'number') {
      return NextResponse.json({ success: false, error: 'Valid rank number required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('vendor_profiles')
      .update({ rank: rank })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('[API ADMIN RANK PATCH] Supabase error:', error);
      if (error.code === '42703') {
        return NextResponse.json({ 
          success: false, 
          error: 'The database rank column is missing. Please run migrations or alter table vendor_profiles.' 
        }, { status: 500 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[API ADMIN RANK PATCH] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}, 'admin');