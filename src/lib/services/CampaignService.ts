import { supabase } from '../supabase';
import type { Campaign } from '../../types/marketing';

export class CampaignService {
  static async getCampaigns(filters?: {
    type?: string[];
    status?: string;
  }): Promise<Campaign[]> {
    let query = supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type?.length) {
      query = query.in('type', filters.type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getCampaign(id: string): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'stats'>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async sendCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('send-campaign', {
        body: { campaign_id: id }
      });

    if (error) throw error;
  }

  static async scheduleCampaign(id: string, sendAt: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .update({
        schedule: { type: 'one-time', sendAt },
        status: 'scheduled'
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async pauseCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'paused' })
      .eq('id', id);

    if (error) throw error;
  }

  static async resumeCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'active' })
      .eq('id', id);

    if (error) throw error;
  }
}