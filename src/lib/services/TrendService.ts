import { supabase } from '../supabase';

export class TrendService {
  static async getTrends(
    metric: string,
    timeRange: string = 'last_30_days',
    filters?: Record<string, any>
  ): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('get-metric-trends', {
        body: { metric, time_range: timeRange, filters }
      });

    if (error) throw error;
    return data;
  }

  static async getComparison(
    metric: string,
    currentRange: string,
    previousRange: string,
    filters?: Record<string, any>
  ): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('get-metric-comparison', {
        body: { metric, current_range: currentRange, previous_range: previousRange, filters }
      });

    if (error) throw error;
    return data;
  }

  static async subscribeToUpdates(
    reportId: string,
    callback: (data: any) => void
  ): Promise<() => void> {
    const channel = supabase
      .channel(`report-${reportId}`)
      .on('broadcast', { event: 'metric-update' }, (payload) => {
        callback(payload.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}