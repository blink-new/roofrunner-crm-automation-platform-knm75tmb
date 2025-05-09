import { supabase } from '../supabase';

export class ReminderService {
  static async getReminderSettings(): Promise<{
    before_due: number[];
    after_due: number[];
    late_fee?: {
      type: 'percentage' | 'fixed';
      value: number;
      grace_period: number;
    };
  }> {
    const { data, error } = await supabase
      .from('reminder_settings')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return defaults
        return {
          before_due: [1, 3, 7],
          after_due: [1, 3, 7, 14]
        };
      }
      throw error;
    }
    
    return data;
  }

  static async updateReminderSettings(settings: {
    before_due: number[];
    after_due: number[];
    late_fee?: {
      type: 'percentage' | 'fixed';
      value: number;
      grace_period: number;
    };
  }): Promise<void> {
    const { error } = await supabase
      .from('reminder_settings')
      .upsert([settings]);

    if (error) throw error;
  }

  static async sendReminder(invoiceId: string, options?: {
    template?: string;
    message?: string;
  }): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('send-invoice-reminder', {
        body: { invoice_id: invoiceId, ...options }
      });

    if (error) throw error;
  }

  static async getReminders(invoiceId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('invoice_reminders')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async applyLateFee(invoiceId: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('apply-late-fee', {
        body: { invoice_id: invoiceId }
      });

    if (error) throw error;
  }
}