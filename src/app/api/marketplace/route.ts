import { NextResponse } from 'next/server';
import { marketplaceService } from '@/modules/marketplace/marketplace.service';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';

// Helper function to map a database item to the structure expected by the frontend
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

// GET /api/marketplace — Fetch all non-deleted, unsold marketplace items. Optional filter by category.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const result = await marketplaceService.listItems({ category });
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    const mappedData = (result.data || []).map(mapDbItemToFrontend);
    return NextResponse.json({ success: true, data: mappedData }, { status: 200 });
  } catch (err: any) {
    console.error('[API MARKETPLACE GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/marketplace — List a new item for sale
export const POST = withAuth(async (req: Request, user: any) => {
  try {
    const contentType = req.headers.get('content-type') || '';
    let itemData: any = {};
    let imageUrls: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      // Extract form fields
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      const price = parseFloat(formData.get('price') as string) || 0;
      const condition = formData.get('condition') as string;
      const location = formData.get('location') as string;

      // Handle image uploads
      const imageFiles = formData.getAll('images');
      for (const file of imageFiles) {
        if (file instanceof File) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const path = `marketplace/${Date.now()}_${file.name}`;
          const { error } = await supabaseAdmin.storage
            .from('house-images')
            .upload(path, buffer, { contentType: file.type, upsert: false });

          if (!error) {
            const { data: urlData } = supabaseAdmin.storage
              .from('house-images')
              .getPublicUrl(path);
            if (urlData?.publicUrl) {
              imageUrls.push(urlData.publicUrl);
            }
          } else {
            console.error('[API MARKETPLACE POST] Image upload failed:', error);
          }
        }
      }

      itemData = {
        title,
        description,
        category,
        price,
        condition,
        location,
        images: imageUrls
      };
    } else {
      const body = await req.json();
      itemData = {
        title: body.title,
        description: body.description,
        category: body.category,
        price: parseFloat(body.price) || 0,
        condition: body.condition,
        location: body.location,
        images: body.images || []
      };
    }

    if (!user.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized user.' }, { status: 401 });
    }

    const result = await marketplaceService.createItem({
      sellerId: user.userId,
      ...itemData
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (err: any) {
    console.error('[API MARKETPLACE POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
});
