import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req: Request, user: any, context: any) => {
  if (user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const params = await context?.params;
  const type = params?.type;
  if (!type) {
    return NextResponse.json({ success: false, error: 'Analytics type required' }, { status: 400 });
  }

  try {
    if (type === 'kpi') {
      // 1. Total & Today's Revenue (Completed Payments sum)
      const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'captured');

      const totalRevenue = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayRevenue = (payments || [])
        .filter(p => new Date(p.created_at) >= todayStart)
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      // 2. Counts: Users & Active Bookings
      const { count: usersCount, error: usersError } = await supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'user');

      if (usersError) {
        console.error('[API ADMIN ANALYTICS KPI] Profiles query error:', usersError);
      }

      const { count: activeBookings, error: bookingsError } = await supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      if (bookingsError) {
        console.error('[API ADMIN ANALYTICS KPI] Bookings query error:', bookingsError);
      }

      return NextResponse.json({
        success: true,
        data: {
          revenue: {
            total: totalRevenue || 0,
            today: todayRevenue || 0,
          },
          counts: {
            users: usersCount !== null ? usersCount : 0,
            activeBookings: activeBookings !== null ? activeBookings : 0,
          }
        }
      });
    }

    if (type === 'revenue') {
      // Return dynamic daily revenue velocity for the last 7 days
      const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'captured')
        .order('created_at', { ascending: true });

      const dailyMap: Record<string, number> = {};
      
      // Seed last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyMap[label] = 0;
      }

      (payments || []).forEach(p => {
        const dateLabel = new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dailyMap[dateLabel] !== undefined) {
          dailyMap[dateLabel] += p.amount || 0;
        }
      });

      const trends = Object.entries(dailyMap).map(([date, amount]) => ({
        _id: date,
        amount,
      }));

      return NextResponse.json({ success: true, data: trends });
    }

    if (type === 'modules') {
      // Calculate revenue sum split by module types
      const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('amount, service_type')
        .eq('status', 'captured');

      const moduleMap: Record<string, number> = {
        'Rooms': 0,
        'Vehicles': 0,
        'Laundry': 0,
      };

      (payments || []).forEach(p => {
        if (p.service_type === 'house') {
          moduleMap['Rooms'] += p.amount || 0;
        } else if (p.service_type === 'vehicle') {
          moduleMap['Vehicles'] += p.amount || 0;
        } else if (p.service_type === 'laundry') {
          moduleMap['Laundry'] += p.amount || 0;
        }
      });

      const moduleData = Object.entries(moduleMap).map(([name, revenue]) => ({
        _id: name,
        revenue,
      }));

      return NextResponse.json({ success: true, data: moduleData });
    }

    if (type === 'conversion') {
      const { count: totalBookings } = await supabaseAdmin
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const { count: completedPayments } = await supabaseAdmin
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'captured');

      const ratio = totalBookings ? Math.round((completedPayments || 0) / totalBookings * 100) : 0;

      return NextResponse.json({
        success: true,
        data: {
          totalBookings: totalBookings || 0,
          completedPayments: completedPayments || 0,
          bookingToPaymentRatio: ratio || 0,
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown analytics type' }, { status: 400 });

  } catch (err: any) {
    console.error(`[API ADMIN ANALYTICS ${type.toUpperCase()}] Error:`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}, 'admin');
