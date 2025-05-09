import { supabase } from '../supabase';

export class PaymentLinkService {
  static async getPaymentLinks(): Promise<any[]> {
    const { data, error } = await supabase
      .from('payment_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createPaymentLink(options: {
    amount: number;
    description: string;
    expires_at?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    id: string;
    url: string;
    expires_at?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('create-payment-link', {
        body: options
      });

    if (error) throw error;
    return data;
  }

  static async createText2Pay(options: {
    amount: number;
    description: string;
    phone: string;
    expires_at?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    id: string;
    url: string;
    expires_at?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('create-text2pay', {
        body: options
      });

    if (error) throw error;
    return data;
  }

  static async getPaymentLinkStats(id: string): Promise<{
    views: number;
    conversions: number;
    conversion_rate: number;
    total_amount: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('payment-link-stats', {
        body: { link_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async deletePaymentLink(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}