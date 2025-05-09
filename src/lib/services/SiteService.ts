import { supabase } from '../supabase';
import type { Site } from '../../types/sites';

export class SiteService {
  static async getSites(): Promise<Site[]> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getSite(id: string): Promise<Site> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createSite(site: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site> {
    const { data, error } = await supabase
      .from('sites')
      .insert([site])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSite(id: string, updates: Partial<Site>): Promise<Site> {
    const { data, error } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSite(id: string): Promise<void> {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async duplicateSite(id: string): Promise<Site> {
    const { data: original, error: fetchError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data: duplicate, error: insertError } = await supabase
      .from('sites')
      .insert([{
        ...original,
        id: undefined,
        name: `${original.name} (Copy)`,
        domain: undefined,
        created_at: undefined,
        updated_at: undefined
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return duplicate;
  }
}