import { supabaseAdmin } from '@/lib/supabase-admin';
import type { HouseRow, HouseWithVendor, HouseInput } from './house.types';

export const houseService = {
  /**
   * List all non-deleted, available houses. Optionally filter by property type.
   */
  async list(filters?: { propertyType?: string }): Promise<{ success: boolean; data?: HouseWithVendor[]; error?: string }> {
    try {
      let query = supabaseAdmin
        .from('houses')
        .select('*, vendor:profiles!vendor_id(id, name, email, phone)')
        .eq('is_deleted', false)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (filters?.propertyType && filters.propertyType !== 'all') {
        query = query.eq('property_type', filters.propertyType);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[HOUSE SERVICE] list error:', error);
        return { success: false, error: 'Failed to fetch houses.' };
      }
      return { success: true, data: (data || []) as HouseWithVendor[] };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] list error:', err);
      return { success: true, data: [] };
    }
  },

  /**
   * List all houses belonging to a specific vendor.
   */
  async listByVendor(vendorId: string): Promise<{ success: boolean; data?: HouseRow[]; error?: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('houses')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[HOUSE SERVICE] listByVendor error:', error);
        return { success: false, error: 'Failed to fetch vendor houses.' };
      }
      return { success: true, data: (data || []) as HouseRow[] };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] listByVendor error:', err);
      return { success: false, error: 'Failed to fetch houses.' };
    }
  },

  /**
   * Get single house by ID with vendor info.
   */
  async getById(id: string): Promise<{ success: boolean; data?: HouseWithVendor; error?: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('houses')
        .select('*, vendor:profiles!vendor_id(id, name, email, phone)')
        .eq('id', id)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error || !data) {
        return { success: false, error: 'Property not found.' };
      }
      return { success: true, data: data as HouseWithVendor };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] getById error:', err);
      return { success: false, error: 'Failed to fetch property.' };
    }
  },

  /**
   * Create a new house listing.
   */
  async create(vendorId: string, input: HouseInput): Promise<{ success: boolean; data?: HouseRow; error?: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('houses')
        .insert({
          vendor_id: vendorId,
          title: input.title,
          description: input.description,
          property_type: input.propertyType,
          address: input.address,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          bedrooms: input.bedrooms || 1,
          bathrooms: input.bathrooms || 1,
          area: input.area || null,
          room_size: input.roomSize || null,
          bed_type: input.bedType || null,
          price_per_month: input.pricePerMonth || null,
          price_per_day: input.pricePerDay || null,
          single_sharing_price: input.singleSharingPrice || null,
          double_sharing_price: input.doubleSharingPrice || null,
          triple_sharing_price: input.tripleSharingPrice || null,
          security_deposit: input.securityDeposit || null,
          lockin_period: input.lockinPeriod || '0 months',
          notice_period: input.noticePeriod || '15 days',
          electricity_included: input.electricityIncluded ?? true,
          electricity_charge: input.electricityCharge || null,
          location_url: input.locationUrl || null,
          tenants_staying: input.tenantsStaying || 0,
          faqs: input.faqs || [],
          amenities: input.amenities || {},
          images: input.images || [],
          approval_status: 'approved',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[HOUSE SERVICE] create error:', error);
        return { success: false, error: 'Failed to add property.' };
      }
      return { success: true, data: data as HouseRow };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] create error:', err);
      return { success: false, error: 'Failed to add property.' };
    }
  },

  /**
   * Soft-delete a house.
   */
  async delete(id: string, vendorId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin
        .from('houses')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('vendor_id', vendorId);

      if (error) {
        console.error('[HOUSE SERVICE] delete error:', error);
        return { success: false, error: 'Failed to delete property.' };
      }
      return { success: true };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] delete error:', err);
      return { success: false, error: 'Failed to delete property.' };
    }
  },

  /**
   * Upload image to Supabase Storage and return public URL.
   */
  async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string | null> {
    try {
      const path = `houses/${Date.now()}_${fileName}`;
      const { error } = await supabaseAdmin.storage
        .from('house-images')
        .upload(path, file, { contentType, upsert: false });

      if (error) {
        console.error('[HOUSE SERVICE] upload error:', error);
        return null;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from('house-images')
        .getPublicUrl(path);

      return urlData.publicUrl;
    } catch (err: any) {
      console.error('[HOUSE SERVICE] upload error:', err);
      return null;
  /**
   * Get Room Management data (Live Board) for vendor.
   */
  async getRoomManagement(vendorId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // 1. Fetch all houses/rooms for this vendor
      const { data: houses, error: houseError } = await supabaseAdmin
        .from('houses')
        .select('id, title, property_type, address, city, price_per_month, price_per_day, is_available, images')
        .eq('vendor_id', vendorId)
        .eq('is_deleted', false);

      if (houseError) return { success: false, error: 'Failed to fetch rooms.' };

      // 2. Fetch all active bookings for these houses
      const houseIds = houses?.map(h => h.id) || [];
      let activeBookings: any[] = [];
      if (houseIds.length > 0) {
        const { data: bookings } = await supabaseAdmin
          .from('bookings')
          .select('id, service_id, start_date, end_date, booking_type, payment_status, total_amount, user:profiles!user_id(name, phone)')
          .in('service_id', houseIds)
          .in('status', ['pending', 'confirmed']);
        activeBookings = bookings || [];
      }

      // 3. Calculate today's revenue (bookings created today or total amount overlapping today)
      // For simplicity, sum of total_amount of active bookings
      const today = new Date();
      today.setHours(0,0,0,0);
      const { data: todayBookings } = await supabaseAdmin
        .from('bookings')
        .select('total_amount')
        .eq('vendor_id', vendorId)
        .in('service_type', ['house', 'room', 'pg'])
        .gte('created_at', today.toISOString());
      
      const todayRevenue = todayBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // 4. Map houses with their current booking
      const mappedRooms = houses?.map(house => {
        const currentBooking = activeBookings.find(b => b.service_id === house.id);
        let rentStatus = 'paid';
        let daysUntilDue = 0;
        let isOverdue = false;
        let overdueDays = 0;
        let nextDueDate = null;

        if (currentBooking) {
          // Calculate rent due logic
          const start = new Date(currentBooking.start_date);
          const now = new Date();
          
          if (currentBooking.booking_type === 'monthly') {
             // Next due date is the same day of the month as start_date, for the upcoming month
             let nextMonth = now.getMonth();
             let year = now.getFullYear();
             if (now.getDate() > start.getDate()) {
                nextMonth += 1;
                if (nextMonth > 11) {
                   nextMonth = 0;
                   year += 1;
                }
             }
             nextDueDate = new Date(year, nextMonth, start.getDate());
          } else {
             nextDueDate = new Date(currentBooking.end_date);
          }

          const diffMs = nextDueDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          
          if (diffDays < 0) {
            isOverdue = true;
            overdueDays = Math.abs(diffDays);
            rentStatus = 'overdue';
          } else {
            daysUntilDue = diffDays;
            if (daysUntilDue <= 5) rentStatus = 'due_soon';
          }
          
          if (currentBooking.payment_status !== 'paid' && currentBooking.payment_status !== 'completed') {
            rentStatus = 'unpaid';
            if (diffDays < 0) {
                isOverdue = true;
                overdueDays = Math.abs(diffDays);
                rentStatus = 'overdue';
            }
          } else {
            // If it's paid, it's paid for the current cycle
            rentStatus = 'paid';
            isOverdue = false;
          }
        }

        return {
          _id: house.id,
          title: house.title,
          propertyType: house.property_type,
          pricePerMonth: house.price_per_month,
          pricePerDay: house.price_per_day,
          isAvailable: house.is_available,
          images: house.images || [],
          currentStatus: house.is_available ? 'available' : 'occupied',
          currentBooking: currentBooking ? {
            _id: currentBooking.id,
            startDate: currentBooking.start_date,
            endDate: currentBooking.end_date,
            bookingType: currentBooking.booking_type,
            totalAmount: currentBooking.total_amount,
            paymentStatus: currentBooking.payment_status,
            customer: Array.isArray(currentBooking.user) ? currentBooking.user[0] : currentBooking.user,
            rentStatus,
            daysUntilDue,
            isOverdue,
            overdueDays,
            nextDueDate: nextDueDate?.toISOString()
          } : null
        };
      });

      return { 
        success: true, 
        data: {
          rooms: mappedRooms || [],
          todayRevenue
        }
      };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] getRoomManagement error:', err);
      return { success: false, error: 'Failed to fetch room management data.' };
  async checkIn(id: string, vendorId: string, payload: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { customerName, customerPhone, customerEmail, startDate, endDate, bookingType, totalAmount } = payload;
      
      // Set house as unavailable
      const { error: updateError } = await supabaseAdmin
        .from('houses')
        .update({ is_available: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('vendor_id', vendorId);
        
      if (updateError) return { success: false, error: 'Failed to update room status.' };

      // Get or create offline customer profile if needed, or just insert booking with vendor as user for now.
      // For a real app we'd create an offline customer, but for MVP we will use the vendor's user_id 
      // but store the actual name in notes to avoid schema issues if user_id is required.
      const { error: bookError } = await supabaseAdmin
        .from('bookings')
        .insert({
          user_id: vendorId, // offline customer fallback
          vendor_id: vendorId,
          service_type: 'room',
          service_id: id,
          start_date: startDate || new Date().toISOString(),
          end_date: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          booking_type: bookingType || 'monthly',
          total_amount: totalAmount || 0,
          payment_status: 'pending',
          status: 'confirmed',
          notes: JSON.stringify({ offlineCustomer: { name: customerName, phone: customerPhone, email: customerEmail } })
        });
        
      if (bookError) console.error('[HOUSE SERVICE] checkIn booking error:', bookError);

      return { success: true };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] checkIn error:', err);
      return { success: false, error: 'Failed to check in.' };
    }
  },

  async checkOut(id: string, vendorId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Set house as available
      const { error: updateError } = await supabaseAdmin
        .from('houses')
        .update({ is_available: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('vendor_id', vendorId);
        
      if (updateError) return { success: false, error: 'Failed to update room status.' };

      // Find active booking and mark completed
      const { data: bookings } = await supabaseAdmin
        .from('bookings')
        .select('id')
        .eq('service_id', id)
        .eq('vendor_id', vendorId)
        .in('status', ['pending', 'confirmed'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (bookings && bookings.length > 0) {
         await supabaseAdmin.from('bookings').update({
             status: 'completed',
             end_date: new Date().toISOString(),
             updated_at: new Date().toISOString()
         }).eq('id', bookings[0].id);
      }

      return { success: true };
    } catch (err: any) {
      console.error('[HOUSE SERVICE] checkOut error:', err);
      return { success: false, error: 'Failed to check out.' };
    }
  },

  async markRentPaid(bookingId: string): Promise<{ success: boolean; error?: string }> {
     try {
       const { error } = await supabaseAdmin.from('bookings').update({
          payment_status: 'paid',
          updated_at: new Date().toISOString()
       }).eq('id', bookingId);
       
       if (error) return { success: false, error: 'Failed to mark as paid.' };
       return { success: true };
     } catch (err: any) {
       return { success: false, error: 'Failed to mark as paid.' };
     }
  }
};
