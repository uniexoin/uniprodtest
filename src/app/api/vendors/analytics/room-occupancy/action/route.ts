import { NextResponse } from 'next/server';
import { houseService } from '@/modules/house/house.service';
import { withAuth } from '@/lib/api-auth';

export const POST = withAuth(async (req: Request, user: any) => {
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { action, id, bookingId, payload } = body;
    
    let result;
    if (action === 'check_in') {
       result = await houseService.checkIn(id, user.userId, payload);
    } else if (action === 'check_out') {
       result = await houseService.checkOut(id, user.userId);
    } else if (action === 'mark_paid') {
       result = await houseService.markRentPaid(bookingId);
    } else {
       return NextResponse.json({ success: false, error: 'Invalid action' });
    }
    
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API ROOM ACTION] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}, 'vendor');
