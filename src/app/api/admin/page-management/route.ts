import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role || (role !== 'user' && role !== 'vendor')) {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
    }

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, role, page_taken_down, created_at')
      .eq('role', role)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PAGE MANAGEMENT GET] DB Error:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: profiles }, { status: 200 });
  } catch (err: any) {
    console.error('[PAGE MANAGEMENT GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userIds, pageTakenDown } = body;

    if (!Array.isArray(userIds) || userIds.length === 0 || typeof pageTakenDown !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ page_taken_down: pageTakenDown })
      .in('id', userIds);

    if (error) {
      console.error('[PAGE MANAGEMENT POST] DB Error:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Status updated successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('[PAGE MANAGEMENT POST] Error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
