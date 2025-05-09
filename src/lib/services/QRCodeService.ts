import { supabase } from '../supabase';

export class QRCodeService {
  static async generateQRCode(settings: {
    content: string;
    size?: number;
    color?: string;
    logo?: string;
    format?: 'png' | 'svg';
  }): Promise<{
    url: string;
    download_url: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('generate-qr-code', {
        body: settings
      });

    if (error) throw error;
    return data;
  }

  static async getReviewQRCodes(): Promise<any[]> {
    const { data, error } = await supabase
      .from('review_qr_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createReviewQRCode(qrCode: {
    name: string;
    platform: string;
    url: string;
    settings: {
      size: number;
      color: string;
      logo: boolean;
    };
  }): Promise<any> {
    const { data, error } = await supabase
      .from('review_qr_codes')
      .insert([qrCode])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateReviewQRCode(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('review_qr_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteReviewQRCode(id: string): Promise<void> {
    const { error } = await supabase
      .from('review_qr_codes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async trackQRCodeScan(id: string, metadata?: Record<string, any>): Promise<void> {
    const { error } = await supabase
      .from('review_qr_code_scans')
      .insert([{
        qr_code_id: id,
        metadata
      }]);

    if (error) throw error;
  }

  static async getQRCodeStats(id: string): Promise<{
    total_scans: number;
    scans_by_date: {
      date: string;
      count: number;
    }[];
    conversion_rate: number;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('qr-code-stats', {
        body: { qr_code_id: id }
      });

    if (error) throw error;
    return data;
  }
}