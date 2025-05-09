import { supabase } from '../supabase';

export class PlatformService {
  static async getPlatforms(): Promise<any[]> {
    const { data, error } = await supabase
      .from('review_platforms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getPlatform(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('review_platforms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async connectPlatform(platform: {
    name: string;
    credentials: Record<string, any>;
  }): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('connect-review-platform', {
        body: platform
      });

    if (error) throw error;
    return data;
  }

  static async disconnectPlatform(id: string): Promise<void> {
    const { error } = await supabase
      .from('review_platforms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async syncPlatform(id: string): Promise<{
    success: boolean;
    count: number;
    message?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('sync-platform', {
        body: { platform_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async getPlatformStats(id: string): Promise<{
    total_reviews: number;
    average_rating: number;
    rating_distribution: Record<number, number>;
    recent_reviews: any[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('platform-stats', {
        body: { platform_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async getAvailablePlatforms(): Promise<{
    name: string;
    id: string;
    logo_url: string;
    description: string;
    connected: boolean;
  }[]> {
    const { data, error } = await supabase
      .functions
      .invoke('available-review-platforms', {});

    if (error) throw error;
    return data;
  }
}