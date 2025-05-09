import { supabase } from '../supabase';

export class TriggerLinkService {
  static async getTriggerLinks(): Promise<any[]> {
    const { data, error } = await supabase
      .from('trigger_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createTriggerLink(link: {
    name: string;
    action: string;
    parameters?: Record<string, any>;
    expires_at?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('trigger_links')
      .insert([link])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTriggerLink(id: string, updates: Partial<{
    name: string;
    action: string;
    parameters: Record<string, any>;
    expires_at: string;
    active: boolean;
  }>): Promise<any> {
    const { data, error } = await supabase
      .from('trigger_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTriggerLink(id: string): Promise<void> {
    const { error } = await supabase
      .from('trigger_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getTriggerLinkStats(id: string): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('trigger-link-stats', {
        body: { link_id: id }
      });

    if (error) throw error;
    return data;
  }

  static generateShortcode(linkId: string): string {
    return `[trigger:${linkId}]`;
  }
}