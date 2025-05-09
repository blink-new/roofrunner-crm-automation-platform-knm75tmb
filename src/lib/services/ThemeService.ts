import { supabase } from '../supabase';

export class ThemeService {
  static async getThemes(): Promise<any[]> {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getTheme(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createTheme(theme: {
    name: string;
    description?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    typography: {
      heading_font: string;
      body_font: string;
      base_size: string;
      scale_ratio: number;
    };
    spacing: {
      base_unit: string;
      scale_ratio: number;
    };
    borders: {
      radius: string;
      width: string;
    };
  }): Promise<any> {
    const { data, error } = await supabase
      .from('themes')
      .insert([theme])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTheme(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('themes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTheme(id: string): Promise<void> {
    const { error } = await supabase
      .from('themes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async listTemplates(type: 'page' | 'funnel' | 'block'): Promise<any[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getTemplate(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async applyTemplate(
    targetId: string,
    templateId: string,
    targetType: 'page' | 'funnel'
  ): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('apply-template', {
        body: {
          target_id: targetId,
          template_id: templateId,
          target_type: targetType
        }
      });

    if (error) throw error;
  }
}