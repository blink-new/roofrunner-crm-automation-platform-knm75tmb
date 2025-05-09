import { supabase } from '../supabase';

export class CallReportService {
  static async list(filters?: {
    dateRange?: { start: string; end: string };
    direction?: 'inbound' | 'outbound' | 'all';
    duration?: { min?: number; max?: number };
    agents?: string[];
  }): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('call-report', {
        body: { filters }
      });

    if (error) throw error;
    return data;
  }

  static async getStats(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('call-stats', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getCallDistribution(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('call-distribution', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }
}