import { supabase } from '../supabase';

export class AdService {
  static async getAdCampaigns(): Promise<any[]> {
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAdCampaign(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select(`
        *,
        ad_sets:ad_sets(
          *,
          ads:ads(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createAdCampaign(campaign: {
    name: string;
    platform: string;
    objective: string;
    budget: number;
    budget_type: 'daily' | 'lifetime';
    start_date: string;
    end_date?: string;
    audience_id?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('ad_campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAdCampaign(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('ad_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAdCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('ad_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getAdStats(id: string): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('ad-campaign-stats', {
        body: { campaign_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async syncAdAccount(platform: string, credentials: any): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('sync-ad-account', {
        body: { platform, credentials }
      });

    if (error) throw error;
  }
}