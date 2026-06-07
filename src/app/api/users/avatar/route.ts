import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

/**
 * POST /api/users/avatar — Upload a profile picture.
 * Accepts multipart/form-data with an 'avatar' field.
 */
export const POST = withAuth(async (req, user) => {
  try {
    const formData = await req.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No avatar file provided.' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 5MB.' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique path
    const ext = file.name.split('.').pop() || 'jpg';
    const storagePath = `avatars/${user.userId}_${Date.now()}.${ext}`;

    // Upload to Supabase Storage (use 'house-images' bucket which already exists)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('house-images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[AVATAR UPLOAD] Storage error:', uploadError);
      return NextResponse.json({ success: false, error: 'Failed to upload avatar.' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('house-images')
      .getPublicUrl(storagePath);

    const avatarUrl = urlData.publicUrl;

    // Update profile with new avatar URL
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.userId);

    if (updateError) {
      console.error('[AVATAR UPLOAD] Profile update error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update avatar.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { avatar: avatarUrl } });
  } catch (err: any) {
    console.error('[AVATAR UPLOAD] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
