import { supabase } from '../supabase';

export class AttributionService {
  static async list(filters?: {
    dateRange?: { start: string; end: string };
    sources?: string[];
    campaigns?: string[];
  }): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('attribution-report', {
        body: { filters }
      });

    if (error) throw error;
    return data;
  }

  static async getSourceBreakdown(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('attribution-sources', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getCampaignPerformance(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('attribution-campaigns', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getConversionJourney(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('attribution-journey', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }
}