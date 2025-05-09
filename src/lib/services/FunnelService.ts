import { supabase } from '../supabase';
import type { Funnel, FunnelPage } from '../../types/sites';

export class FunnelService {
  static async getFunnels(siteId?: string): Promise<Funnel[]> {
    let query = supabase
      .from('funnels')
      .select('*')
      .order('created_at', { ascending: false });

    if (siteId) {
      query = query.eq('site_id', siteId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getFunnel(id: string): Promise<Funnel> {
    const { data, error } = await supabase
      .from('funnels')
      .select(`
        *,
        pages:funnel_pages(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createFunnel(funnel: Omit<Funnel, 'id' | 'created_at' | 'updated_at'>): Promise<Funnel> {
    const { data, error } = await supabase
      .from('funnels')
      .insert([funnel])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFunnel(id: string, updates: Partial<Funnel>): Promise<Funnel> {
    const { data, error } = await supabase
      .from('funnels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteFunnel(id: string): Promise<void> {
    const { error } = await supabase
      .from('funnels')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getFunnelPages(funnelId: string): Promise<FunnelPage[]> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .select('*')
      .eq('funnel_id', funnelId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createFunnelPage(page: Omit<FunnelPage, 'id' | 'created_at' | 'updated_at'>): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .insert([page])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFunnelPage(id: string, updates: Partial<FunnelPage>): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteFunnelPage(id: string): Promise<void> {
    const { error } = await supabase
      .from('funnel_pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updatePageOrder(funnelId: string, pageOrder: { id: string; position: number }[]): Promise<void> {
    const { error } = await supabase.rpc('update_funnel_page_positions', {
      page_positions: pageOrder
    });

    if (error) throw error;
  }
}