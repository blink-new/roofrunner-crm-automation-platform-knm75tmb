import { supabase } from '../supabase';

export class SMSService {
  static async sendTestSMS(
    to: string,
    message: string,
    from?: string
  ): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('send-test-sms', {
        body: { to, message, from }
      });

    if (error) throw error;
  }

  static async validateTemplate(content: string): Promise<{
    valid: boolean;
    errors?: string[];
    segment_count: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('validate-sms-template', {
        body: { content }
      });

    if (error) throw error;
    return data;
  }

  static async getDeliverabilityStats(): Promise<{
    delivery_rate: number;
    opt_out_rate: number;
    response_rate: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('sms-deliverability-stats', {});

    if (error) throw error;
    return data;
  }
}