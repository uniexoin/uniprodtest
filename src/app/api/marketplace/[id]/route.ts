import { NextResponse } from 'next/server';
import { marketplaceService } from '@/modules/marketplace/marketplace.service';

const mapDbItemToFrontend = (item: any) => ({
  _id: item.id,
  sellerId: item.seller ? {
    _id: item.seller.id,
    name: item.seller.name,
    email: item.seller.email,
    avatarUrl: item.seller.avatar_url
  } : null,
  title: item.title,
  description: item.description,
  category: item.category,
  price: Number(item.price),
  condition: item.condition,
  images: item.images || [],
  location: item.location,
  isSold: item.is_sold,
  createdAt: item.created_at,
  updatedAt: item.updated_at
});

// GET /api/marketplace/[id] — Get single item details by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await marketplaceService.getItemById(id);
    
    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: result.error || 'Item not found.' }, { status: 404 });
    }

    const mappedItem = mapDbItemToFrontend(result.data);
    return NextResponse.json({ success: true, data: mappedItem }, { status: 200 });
  } catch (err: any) {
    console.error('[API MARKETPLACE GET SINGLE] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
