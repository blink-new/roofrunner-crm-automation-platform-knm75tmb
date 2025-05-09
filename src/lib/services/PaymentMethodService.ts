import { supabase } from '../supabase';

export class PaymentMethodService {
  static async list(): Promise<any[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async connect(provider: string, credentials: Record<string, any>): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('connect-payment-method', {
        body: { provider, credentials }
      });

    if (error) throw error;
    return data;
  }

  static async disconnect(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async update(id: string, updates: {
    is_default?: boolean;
    settings?: Record<string, any>;
  }): Promise<any> {
    // If setting as default, unset any existing default
    if (updates.is_default) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('is_default', true);

      if (updateError) throw updateError;
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSettings(provider: string): Promise<any> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('settings')
      .eq('provider', provider)
      .single();

    if (error) throw error;
    return data.settings;
  }
}