import { NextResponse } from 'next/server';
import { vendorService } from '@/modules/vendor/vendor.service';
import { withAuth } from '@/lib/api-auth';

export const GET = withAuth(async (req: Request, user: any) => {
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await vendorService.getStats(user.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API VENDORS ANALYTICS OVERVIEW] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}, 'vendor');
