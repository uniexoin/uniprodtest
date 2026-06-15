import { supabaseAdmin } from '@/lib/supabase-admin';

export const marketplaceService = {
  async listItems(filters?: { category?: string }) {
    try {
      let query = supabaseAdmin
        .from('marketplace_items')
        .select('*, seller:profiles!seller_id(id, name, email, avatar_url)')
        .eq('is_deleted', false)
        .eq('is_sold', false)
        .order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'all') {
        query = query.ilike('category', filters.category);
      }

      const { data, error } = await query;
      return { success: !error, data: data || [], error: error?.message };
    } catch (err: any) {
      console.error('[MARKETPLACE SERVICE] listItems error:', err);
      return { success: false, error: err.message };
    }
  },

  async getItemById(id: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('marketplace_items')
        .select('*, seller:profiles!seller_id(id, name, email, avatar_url)')
        .eq('id', id)
        .eq('is_deleted', false)
        .maybeSingle();

      return { success: !error, data, error: error?.message };
    } catch (err: any) {
      console.error('[MARKETPLACE SERVICE] getItemById error:', err);
      return { success: false, error: err.message };
    }
  },

  async createItem(input: {
    sellerId: string;
    title: string;
    description: string;
    category: string;
    price: number;
    condition: string;
    images?: string[];
    location?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('marketplace_items')
      .insert({
        seller_id: input.sellerId,
        title: input.title,
        description: input.description,
        category: input.category,
        price: input.price,
        condition: input.condition,
        images: input.images || [],
        location: input.location
      })
      .select()
      .single();
    
    return { success: !error, data, error: error?.message };
  },

  async createOffer(input: {
    itemId: string;
    buyerId: string;
    offeredPrice: number;
    message?: string;
  }) {
    // Get seller ID from item
    const { data: item } = await supabaseAdmin
      .from('marketplace_items')
      .select('seller_id')
      .eq('id', input.itemId)
      .maybeSingle();
    
    if (!item) return { success: false, error: 'Item not found' };

    const { data, error } = await supabaseAdmin
      .from('marketplace_offers')
      .insert({
        item_id: input.itemId,
        buyer_id: input.buyerId,
        seller_id: item.seller_id,
        offered_price: input.offeredPrice,
        message: input.message,
        status: 'pending'
      })
      .select()
      .single();
    
    return { success: !error, data, error: error?.message };
  },

  async updateOfferStatus(offerId: string, status: 'accepted' | 'rejected' | 'cancelled') {
    const { data, error } = await supabaseAdmin
      .from('marketplace_offers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', offerId)
      .select()
      .single();
    
    return { success: !error, data, error: error?.message };
  },

  async getMyOffers(userId: string, type: 'buyer' | 'seller') {
    const query = supabaseAdmin
      .from('marketplace_offers')
      .select('*, items:marketplace_items(*), buyer:profiles!buyer_id(name, email), seller:profiles!seller_id(name, email)')
      .eq(type === 'buyer' ? 'buyer_id' : 'seller_id', userId)
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    return { success: !error, data: data || [], error: error?.message };
  }
};
