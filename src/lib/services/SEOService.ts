import { supabase } from '../supabase';
import type { PageMeta } from '../../types/sites';

export class SEOService {
  static async getPageSEO(pageId: string): Promise<PageMeta> {
    const { data, error } = await supabase
      .from('funnel_pages')
      .select('meta')
      .eq('id', pageId)
      .single();

    if (error) throw error;
    return data.meta;
  }

  static async updatePageSEO(pageId: string, meta: PageMeta): Promise<void> {
    const { error } = await supabase
      .from('funnel_pages')
      .update({ meta })
      .eq('id', pageId);

    if (error) throw error;
  }

  static async analyzeSEO(pageId: string): Promise<{
    score: number;
    issues: {
      type: 'error' | 'warning' | 'info';
      message: string;
    }[];
    recommendations: string[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('analyze-seo', {
        body: { page_id: pageId }
      });

    if (error) throw error;
    return data;
  }
}