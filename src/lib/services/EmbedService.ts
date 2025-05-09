import { supabase } from '../supabase';

export class EmbedService {
  static async createEmbedWidget(widget: {
    title: string;
    url: string;
    width: number;
    height: number;
  }) {
    const { data, error } = await supabase
      .from('dashboard_widgets')
      .insert([{
        type: 'embed',
        title: widget.title,
        embedUrl: widget.url,
        embedWidth: widget.width,
        embedHeight: widget.height
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateEmbedWidget(
    id: string,
    updates: Partial<{
      title: string;
      url: string;
      width: number;
      height: number;
    }>
  ) {
    const { data, error } = await supabase
      .from('dashboard_widgets')
      .update({
        title: updates.title,
        embedUrl: updates.url,
        embedWidth: updates.width,
        embedHeight: updates.height
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}