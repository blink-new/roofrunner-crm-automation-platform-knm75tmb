import { supabase } from '../supabase';

export class WidgetService {
  static async getWidgets(): Promise<any[]> {
    const { data, error } = await supabase
      .from('review_widgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getWidget(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('review_widgets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createWidget(widget: {
    name: string;
    site_id?: string;
    settings: {
      theme: string;
      show_rating: boolean;
      max_reviews: number;
      platforms: string[];
      min_rating?: number;
    };
  }): Promise<any> {
    const { data, error } = await supabase
      .from('review_widgets')
      .insert([widget])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWidget(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('review_widgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteWidget(id: string): Promise<void> {
    const { error } = await supabase
      .from('review_widgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getWidgetEmbedCode(id: string): Promise<string> {
    const { data, error } = await supabase
      .functions
      .invoke('get-widget-embed-code', {
        body: { widget_id: id }
      });

    if (error) throw error;
    return data.embed_code;
  }

  static async getWidgetPreview(id: string): Promise<{
    html: string;
    css: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('get-widget-preview', {
        body: { widget_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async getWidgetStats(id: string): Promise<{
    views: number;
    clicks: number;
    conversion_rate: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('widget-stats', {
        body: { widget_id: id }
      });

    if (error) throw error;
    return data;
  }
}