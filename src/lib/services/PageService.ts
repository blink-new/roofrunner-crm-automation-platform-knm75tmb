import { supabase } from '../supabase';
import type { FunnelPage, PageContent, PageMeta } from '../../types/sites';

export class PageService {
  static async getPage(id: string): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePageContent(id: string, content: PageContent): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePageMeta(id: string, meta: PageMeta): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .update({ meta })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async publishPage(id: string): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async unpublishPage(id: string): Promise<FunnelPage> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .update({
        status: 'draft'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPageAnalytics(id: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('page-analytics', {
        body: { page_id: id, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }
}