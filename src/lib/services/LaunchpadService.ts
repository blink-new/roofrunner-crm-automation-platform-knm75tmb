import { supabase } from '../supabase';

export class LaunchpadService {
  static async sendEmail(params: {
    to: string[] | { id: string; email: string }[];
    subject: string;
    content: string;
    from_name?: string;
    reply_to?: string;
    track_opens?: boolean;
    track_clicks?: boolean;
  }): Promise<{ id: string; sent_count: number }> {
    const { data, error } = await supabase
      .functions
      .invoke('launchpad-send-email', {
        body: params
      });

    if (error) throw error;
    return data;
  }

  static async sendSMS(params: {
    to: string[] | { id: string; phone: string }[];
    message: string;
    from?: string;
    media_url?: string;
  }): Promise<{ id: string; sent_count: number }> {
    const { data, error } = await supabase
      .functions
      .invoke('launchpad-send-sms', {
        body: params
      });

    if (error) throw error;
    return data;
  }

  static async getLaunchpadHistory(): Promise<any[]> {
    const { data, error } = await supabase
      .from('launchpad_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getLaunchpadStats(id: string): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('launchpad-stats', {
        body: { id }
      });

    if (error) throw error;
    return data;
  }
}