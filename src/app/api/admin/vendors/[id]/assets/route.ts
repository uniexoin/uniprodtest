import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Helper to check admin access
async function ensureAdmin() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role === 'admin';
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await ensureAdmin();
        if (!isAdmin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id: vendorId } = await params;

        // Fetch vendor profile to get user_id for marketplace items
        const { data: vendorProfile } = await supabaseAdmin
            .from('vendor_profiles')
            .select('user_id')
            .eq('id', vendorId)
            .single();

        const userId = vendorProfile?.user_id;

        // Fetch assets from all known collections for this vendor
        const [housesRes, vehiclesRes, laundryRes, marketplaceRes] = await Promise.all([
            supabaseAdmin.from('houses').select('*').eq('vendor_id', vendorId),
            supabaseAdmin.from('vehicles').select('*').eq('vendor_id', vendorId),
            supabaseAdmin.from('laundry_services').select('*').eq('vendor_id', vendorId),
            userId ? supabaseAdmin.from('marketplace_items').select('*').eq('seller_id', userId).eq('is_deleted', false) : Promise.resolve({ data: [] })
        ]);

        const assets = [
            ...(housesRes.data || []).map(a => ({ ...a, _assetType: 'house' })),
            ...(vehiclesRes.data || []).map(a => ({ ...a, _assetType: 'vehicle' })),
            ...(laundryRes.data || []).map(a => ({ ...a, _assetType: 'laundry' })),
            ...(marketplaceRes.data || []).map(a => ({ ...a, _assetType: 'marketplace' }))
        ];

        return NextResponse.json({ success: true, data: assets });
    } catch (error: any) {
        console.error('Error fetching vendor assets:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await ensureAdmin();
        if (!isAdmin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id: vendorId } = await params;
        const { searchParams } = new URL(request.url);
        const purgeAll = searchParams.get('purgeAll') === 'true';
        const type = searchParams.get('type');
        const assetId = searchParams.get('assetId');

        if (purgeAll) {
            // Fetch vendor profile to get user_id for marketplace items
            const { data: vendorProfile } = await supabaseAdmin
                .from('vendor_profiles')
                .select('user_id')
                .eq('id', vendorId)
                .single();
            const userId = vendorProfile?.user_id;

            // Delete all assets from all tables for this vendor
            const promises = [
                supabaseAdmin.from('houses').delete().eq('vendor_id', vendorId),
                supabaseAdmin.from('vehicles').delete().eq('vendor_id', vendorId),
                supabaseAdmin.from('laundry_services').delete().eq('vendor_id', vendorId)
            ];

            if (userId) {
                // Soft-delete marketplace items to ensure they are hidden
                promises.push(
                    supabaseAdmin.from('marketplace_items').update({ is_deleted: true }).eq('seller_id', userId) as any
                );
            }

            await Promise.all(promises);
            return NextResponse.json({ success: true, message: 'All assets deleted successfully' });
        }

        if (!type || !assetId) {
            return NextResponse.json({ success: false, error: 'Missing type or assetId' }, { status: 400 });
        }

        let tableName = '';
        let ownerColumn = 'vendor_id';
        let ownerId = vendorId;

        if (type === 'marketplace') {
            const { data: vendorProfile } = await supabaseAdmin
                .from('vendor_profiles')
                .select('user_id')
                .eq('id', vendorId)
                .single();
            ownerColumn = 'seller_id';
            ownerId = vendorProfile?.user_id || vendorId;
        }

        switch (type) {
            case 'house': tableName = 'houses'; break;
            case 'vehicle': tableName = 'vehicles'; break;
            case 'laundry': tableName = 'laundry_services'; break;
            case 'marketplace': tableName = 'marketplace_items'; break;
            default:
                return NextResponse.json({ success: false, error: 'Invalid asset type' }, { status: 400 });
        }

        if (type === 'marketplace') {
            // Soft-delete for marketplace items to ensure they are completely hidden
            const { error } = await supabaseAdmin
                .from(tableName)
                .update({ is_deleted: true })
                .eq('id', assetId)
                .eq(ownerColumn, ownerId);
            if (error) throw error;
        } else {
            const { error } = await supabaseAdmin
                .from(tableName)
                .delete()
                .eq('id', assetId)
                .eq(ownerColumn, ownerId);
            if (error) throw error;
        }

        return NextResponse.json({ success: true, message: 'Asset deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting vendor asset:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
