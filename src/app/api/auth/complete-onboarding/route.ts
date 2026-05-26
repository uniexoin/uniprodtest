import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { access_token, role, phone, university_id, business_name, service_type, onsite_pickup, store_delivery } = body;

    if (!access_token || !role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Lazy load supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify token
    const { data: { user }, error: verifyError } = await supabase.auth.getUser(access_token);
    if (verifyError || !user) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }

    // Update the profile
    const updateData: any = {
      role: role,
      onboarding_completed: true,
      phone: phone || null,
    };

    if (role === 'user') {
      if (university_id) updateData.uni_id = university_id;
    } else if (role === 'vendor') {
      if (business_name) updateData.business_name = business_name;
      if (service_type) updateData.service_type = service_type;
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select('*')
      .single();

    if (updateError || !updatedProfile) {
      console.error('[COMPLETE ONBOARDING] Update error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }

    // Use manual custom JWT signature generator exactly like other routes
    const { authHelpers } = await import('@/modules/auth/auth.helpers');
    const safeProfile = authHelpers.sanitizeProfile(updatedProfile);
    const token = authHelpers.generateToken(safeProfile);

    return NextResponse.json({
      success: true,
      token,
      profile: safeProfile
    }, { status: 200 });

  } catch (err: any) {
    console.error('[COMPLETE ONBOARDING] Error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
