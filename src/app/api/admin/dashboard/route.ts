import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  
  try {
    const [usersCount, vendorsCount, bookingsCount, rev, recentB, recentP] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'user'),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'vendor'),
      supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('total_amount').eq('status', 'completed'),
      supabaseAdmin.from('bookings').select('*, userId:profiles!user_id(id, name, email, phone), vendorId:profiles!vendor_id(id, name, email, phone)').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('payments').select('*, userId:profiles!user_id(id, name, email, phone)').order('created_at', { ascending: false }).limit(5)
    ]);
    
    if (usersCount.error) console.error('[API ADMIN DASHBOARD] usersCount error:', usersCount.error);
    if (vendorsCount.error) console.error('[API ADMIN DASHBOARD] vendorsCount error:', vendorsCount.error);
    if (bookingsCount.error) console.error('[API ADMIN DASHBOARD] bookingsCount error:', bookingsCount.error);
    if (rev.error) console.error('[API ADMIN DASHBOARD] rev error:', rev.error);
    if (recentB.error) console.error('[API ADMIN DASHBOARD] recentB error:', recentB.error);
    if (recentP.error) console.error('[API ADMIN DASHBOARD] recentP error:', recentP.error);
    
    const totalRevenue = (rev.data || []).reduce((sum, b) => sum + (b.total_amount || 0), 0);

    // Map database properties to frontend camelCase equivalents
    const mappedBookings = (recentB.data || []).map((b: any) => ({
      _id: b.id,
      userId: b.userId,
      vendorId: b.vendorId,
      status: b.status,
      totalAmount: b.total_amount,
      createdAt: b.created_at,
    }));

    const mappedPayments = (recentP.data || []).map((p: any) => ({
      _id: p.id,
      userId: p.userId,
      amount: p.amount,
      status: p.status,
      createdAt: p.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: usersCount.count || 0,
        totalVendors: vendorsCount.count || 0,
        totalBookings: bookingsCount.count || 0,
        totalRevenue,
        recentBookings: mappedBookings,
        recentPayments: mappedPayments,
      }
    });
  } catch (err: any) {
    console.error('[API ADMIN DASHBOARD GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});