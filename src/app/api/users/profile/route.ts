import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';
import { authHelpers } from '@/modules/auth/auth.helpers';

/**
 * GET /api/users/profile — Fetch the authenticated user's profile.
 */
export const GET = withAuth(async (_req, user) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.userId)
      .maybeSingle();

    if (error) throw error;
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const sanitized = authHelpers.sanitizeProfile(profile);
    return NextResponse.json({ success: true, data: sanitized });
  } catch (err: any) {
    console.error('[USER PROFILE GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});

/**
 * PATCH /api/users/profile — Update the authenticated user's profile fields.
 * Accepts: name, phone, location, universityId, avatar
 */
export const PATCH = withAuth(async (req, user) => {
  try {
    const body = await req.json();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.location !== undefined) updates.location = body.location;
    if (body.universityId !== undefined) updates.university_id = body.universityId;
    if (body.avatar !== undefined) updates.avatar_url = body.avatar;

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', user.userId)
      .select('*')
      .single();

    if (error) {
      console.error('[USER PROFILE PATCH] Error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update profile.' }, { status: 500 });
    }

    const sanitized = authHelpers.sanitizeProfile(updatedProfile);
    return NextResponse.json({ success: true, data: sanitized });
  } catch (err: any) {
    console.error('[USER PROFILE PATCH] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
