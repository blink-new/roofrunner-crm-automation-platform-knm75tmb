import { supabase } from '../supabase';

export class WebhookService {
  static async getWebhooks(siteId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createWebhook(webhook: {
    site_id: string;
    name: string;
    url: string;
    events: string[];
    secret?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('webhooks')
      .insert([webhook])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWebhook(
    id: string,
    updates: Partial<{
      name: string;
      url: string;
      events: string[];
      active: boolean;
    }>
  ): Promise<any> {
    const { data, error } = await supabase
      .from('webhooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteWebhook(id: string): Promise<void> {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async testWebhook(id: string): Promise<{
    success: boolean;
    message: string;
    response?: any;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('test-webhook', {
        body: { webhook_id: id }
      });

    if (error) throw error;
    return data;
  }
}