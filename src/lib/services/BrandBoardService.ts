import { supabase } from '../supabase';

export class BrandBoardService {
  static async getBrandBoards(): Promise<any[]> {
    const { data, error } = await supabase
      .from('brand_boards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getBrandBoard(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('brand_boards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createBrandBoard(board: {
    name: string;
    description?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    typography: {
      heading_font: string;
      body_font: string;
      heading_sizes: Record<string, string>;
      body_sizes: Record<string, string>;
    };
    logo_url?: string;
    assets?: {
      name: string;
      url: string;
      type: string;
    }[];
  }): Promise<any> {
    const { data, error } = await supabase
      .from('brand_boards')
      .insert([board])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBrandBoard(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('brand_boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBrandBoard(id: string): Promise<void> {
    const { error } = await supabase
      .from('brand_boards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async setDefaultBrandBoard(id: string): Promise<void> {
    // First, unset any existing default
    await supabase
      .from('brand_boards')
      .update({ is_default: false })
      .eq('is_default', true);

    // Then set the new default
    const { error } = await supabase
      .from('brand_boards')
      .update({ is_default: true })
      .eq('id', id);

    if (error) throw error;
  }
}