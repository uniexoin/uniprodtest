import { NextResponse } from 'next/server';
import { houseService } from '@/modules/house/house.service';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req: Request, user: any) => {
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  try {
    const result = await houseService.getRoomManagement(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API VENDORS ANALYTICS ROOMS] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}, 'vendor');
