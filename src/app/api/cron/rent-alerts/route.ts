import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { emailService } from '@/modules/email/email.service';
import { notificationService } from '@/modules/notifications/notification.service';

export async function GET(req: Request) {
    try {
        // Validate Cron Secret to protect the endpoint (Optional but recommended)
        const authHeader = req.headers.get('authorization');
        const CRON_SECRET = process.env.CRON_SECRET;
        
        if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const todayDate = new Date().toISOString().split('T')[0];
        let alertsSent = 0;

        // Fetch all active room bookings
        const { data: bookings, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                id, 
                vendor_id,
                start_date, 
                end_date, 
                booking_type, 
                payment_status, 
                total_amount, 
                notes, 
                vendor:profiles!vendor_id(email, name),
                house:houses!service_id(title)
            `)
            .in('service_type', ['house', 'room', 'pg'])
            .in('status', ['pending', 'confirmed'])
            .not('payment_status', 'eq', 'paid')
            .not('payment_status', 'eq', 'completed');

        if (error || !bookings) {
            return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
        }

        for (const booking of bookings) {
            const now = new Date();
            const start = new Date(booking.start_date);
            let nextDueDate = null;

            if (booking.booking_type === 'monthly') {
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
                nextDueDate = new Date(booking.end_date);
            }

            const diffMs = nextDueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            
            let status: 'overdue' | 'due_soon' | null = null;
            let days = 0;

            if (diffDays < 0) {
                status = 'overdue';
                days = Math.abs(diffDays);
            } else if (diffDays <= 5) {
                status = 'due_soon';
                days = diffDays;
            }

            if (status) {
                // Check if alert was already sent today
                let parsedNotes: any = {};
                if (booking.notes) {
                    try {
                        parsedNotes = typeof booking.notes === 'string' ? JSON.parse(booking.notes) : booking.notes;
                    } catch (e) {
                        // ignore
                    }
                }

                if (parsedNotes.lastAlertSent !== todayDate) {
                    // Extract Vendor Info
                    const vendorEmail = Array.isArray(booking.vendor) ? booking.vendor[0]?.email : (booking.vendor as any)?.email;
                    const houseTitle = Array.isArray(booking.house) ? booking.house[0]?.title : (booking.house as any)?.title;
                    const tenantName = parsedNotes?.offlineCustomer?.name || 'Customer';
                    const tenantEmail = parsedNotes?.offlineCustomer?.email;
                    
                    if (vendorEmail && houseTitle) {
                        // 1. Send Email to Vendor
                        await emailService.sendRentAlertToVendor(vendorEmail, {
                            roomName: houseTitle,
                            tenantName,
                            status,
                            days,
                            amount: booking.total_amount || 0
                        });

                        // 2. Send In-App Notification to Vendor
                        await notificationService.createNotification({
                            userId: booking.vendor_id,
                            title: status === 'overdue' ? `Rent Overdue: ${houseTitle}` : `Rent Due Soon: ${houseTitle}`,
                            message: status === 'overdue' 
                                ? `Tenant ${tenantName} is overdue on rent by ${days} days.`
                                : `Tenant ${tenantName} needs to pay rent in ${days} days.`,
                            type: status === 'overdue' ? 'error' : 'warning',
                        });
                        
                        // 3. Send Email to Tenant (if provided)
                        if (tenantEmail) {
                            await emailService.sendRentAlertToTenant(tenantEmail, {
                                roomName: houseTitle,
                                status,
                                days,
                                amount: booking.total_amount || 0
                            });
                        }
                        
                        // Update DB
                        parsedNotes.lastAlertSent = todayDate;
                        await supabaseAdmin
                            .from('bookings')
                            .update({ notes: JSON.stringify(parsedNotes) })
                            .eq('id', booking.id);
                            
                        alertsSent++;
                    }
                }
            }
        }

        return NextResponse.json({ success: true, message: `Processed ${bookings.length} bookings. Sent ${alertsSent} alerts.` });
    } catch (err: any) {
        console.error('[CRON RENT ALERTS] Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
