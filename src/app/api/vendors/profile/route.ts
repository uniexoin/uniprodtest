import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

// Fetch vendor profile
export const GET = withAuth(async (req, user) => {
  try {
    let targetUserId = user.userId;

    // If superadmin wants to view another vendor's profile
    if (user.role === 'admin') {
      const url = new URL(req.url);
      const paramId = url.searchParams.get('vendorId');
      if (paramId) {
        targetUserId = paramId;
      }
    }

    // Fetch profile and related vendor_profiles
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*, vendor_profiles(*)')
      .eq('id', targetUserId)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (!profile) return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });

    const vp = Array.isArray(profile.vendor_profiles) 
      ? profile.vendor_profiles[0] 
      : (profile.vendor_profiles || {});

    // Map database properties (snake_case) to camelCase frontend properties
    const mappedData = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      kycStatus: profile.kyc_status,
      businessName: vp.business_name || profile.name || 'Vendor',
      serviceType: vp.service_type || 'ROOM',
      approvalStatus: vp.approval_status || 'approved',
      businessPhone: vp.business_phone || profile.phone || '',
      businessAddress: vp.business_address || '',
      description: vp.description || '',
    };

    return NextResponse.json({ success: true, data: mappedData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});

// Update or create vendor profile
export const PATCH = withAuth(async (req, user) => {
  try {
    const body = await req.json();

    // 1. Prepare updates for vendor_profiles table
    const vendorUpdates: Record<string, any> = {
      user_id: user.userId,
      updated_at: new Date().toISOString(),
    };

    if (body.businessName !== undefined) vendorUpdates.business_name = body.businessName;
    if (body.businessPhone !== undefined) vendorUpdates.business_phone = body.businessPhone;
    if (body.businessAddress !== undefined) vendorUpdates.business_address = body.businessAddress;
    if (body.serviceType !== undefined) vendorUpdates.service_type = body.serviceType;
    if (body.description !== undefined) vendorUpdates.description = body.description;

    // 2. Perform upsert on vendor_profiles table (creates if missing, updates if exists)
    const { data: vpData, error: vpError } = await supabaseAdmin
      .from('vendor_profiles')
      .upsert(vendorUpdates, { onConflict: 'user_id' })
      .select()
      .maybeSingle();

    if (vpError) {
      // If description column doesn't exist, omit it and retry
      if (vpError.message.includes('column "description" does not exist')) {
        delete vendorUpdates.description;
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from('vendor_profiles')
          .upsert(vendorUpdates, { onConflict: 'user_id' })
          .select()
          .maybeSingle();
        if (retryError) throw retryError;
      } else {
        throw vpError;
      }
    }

    // 3. Also update main profile display name/phone if provided
    const profileUpdates: Record<string, any> = {};
    if (body.businessName) profileUpdates.name = body.businessName;
    if (body.businessPhone) profileUpdates.phone = body.businessPhone;

    if (Object.keys(profileUpdates).length > 0) {
      await supabaseAdmin
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.userId);
    }

    return NextResponse.json({ success: true, message: 'Vendor profile updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
