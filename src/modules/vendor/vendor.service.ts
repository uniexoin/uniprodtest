import { supabaseAdmin } from '@/lib/supabase-admin';

export const vendorService = {
  async getProfile(vendorId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', vendorId)
      .eq('role', 'vendor')
      .maybeSingle();
    return { success: !error, data, error: error?.message };
  },

  async getStats(vendorId: string) {
    // 1. Vehicles Stats
    const { data: vehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('is_deleted', false);

    const totalVehicles = vehicles?.length || 0;
    const activeVehicles = vehicles?.filter(v => v.is_available && v.current_status === 'available').length || 0;
    const dispatchedVehicles = vehicles?.filter(v => v.current_status === 'dispatched').length || 0;
    const maintenanceVehicles = vehicles?.filter(v => v.current_status === 'maintenance').length || 0;

    // 2. Houses Stats
    const { data: houses } = await supabaseAdmin
      .from('houses')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('is_deleted', false);

    const totalHouses = houses?.length || 0;
    const pgCount = houses?.filter(h => h.property_type === 'pg').length || 0;
    const roomCount = houses?.filter(h => h.property_type === 'room').length || 0;
    const activeHouses = houses?.filter(h => h.is_available).length || 0;

    // 3. Bookings Stats
    const { data: bookings } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('vendor_id', vendorId);

    const totalBookings = bookings?.length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
    const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;

    // Bookings today
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const bookingsToday = bookings?.filter(b => new Date(b.created_at) >= startOfToday).length || 0;

    // 4. Financial Calculations
    const confirmedOrCompleted = bookings?.filter(b => ['confirmed', 'completed'].includes(b.status || '')) || [];
    const netEarnings = confirmedOrCompleted.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
    const avgBookingValue = totalBookings > 0 ? Math.round(netEarnings / totalBookings) : 0;

    // Conversion rate: (confirmed + completed) / total bookings
    const conversionRate = totalBookings > 0 ? Math.round((confirmedOrCompleted.length / totalBookings) * 100) : 0;

    // Fetch vendor profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('service_type')
      .eq('id', vendorId)
      .maybeSingle();

    return {
      success: true,
      data: {
        // Enriched vehicle metrics
        totalVehicles,
        activeVehicles,
        dispatchedVehicles,
        maintenanceVehicles,

        // Enriched house metrics
        totalHouses,
        pgCount,
        roomCount,
        activeHouses,

        // Unified overview metrics for vendor-analytics.tsx
        netEarnings,
        conversionRate,
        totalBookings,
        avgBookingValue,
        momGrowth: 15,
        bookingsToday,
        completedBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        serviceType: profile?.service_type || 'business',
      }
    };
  }
};
