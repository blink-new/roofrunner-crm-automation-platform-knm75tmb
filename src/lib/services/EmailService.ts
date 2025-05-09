import { supabase } from '../supabase';

export class EmailService {
  static async sendTestEmail(
    to: string,
    subject: string,
    content: string,
    from?: string
  ): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('send-test-email', {
        body: { to, subject, content, from }
      });

    if (error) throw error;
  }

  static async validateTemplate(content: string): Promise<{
    valid: boolean;
    errors?: string[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('validate-email-template', {
        body: { content }
      });

    if (error) throw error;
    return data;
  }

  static async getDeliverabilityStats(): Promise<{
    domain_status: 'verified' | 'pending' | 'failed';
    spam_score: number;
    bounce_rate: number;
    open_rate: number;
    click_rate: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('email-deliverability-stats', {});

    if (error) throw error;
    return data;
  }
}