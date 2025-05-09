import { supabase } from '../supabase';

export class AppointmentReportService {
  static async list(filters?: {
    dateRange?: { start: string; end: string };
    status?: string[];
    assignedTo?: string[];
  }): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('appointment-report', {
        body: { filters }
      });

    if (error) throw error;
    return data;
  }

  static async getStats(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('appointment-stats', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getConversionRates(timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('appointment-conversion-rates', {
        body: { time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }
}