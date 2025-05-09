import { supabase } from '../supabase';

export class AnalyticsService {
  static async getSiteAnalytics(siteId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('site-analytics', {
        body: { site_id: siteId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getFunnelAnalytics(funnelId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('funnel-analytics', {
        body: { funnel_id: funnelId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getPageAnalytics(pageId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('page-analytics', {
        body: { page_id: pageId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getFormSubmissionStats(formId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('form-submission-stats', {
        body: { form_id: formId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getTrafficSources(siteId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('traffic-sources', {
        body: { site_id: siteId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getDeviceBreakdown(siteId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('device-breakdown', {
        body: { site_id: siteId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getConversionRates(funnelId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('conversion-rates', {
        body: { funnel_id: funnelId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async exportAnalyticsReport(siteId: string, format: 'csv' | 'pdf'): Promise<string> {
    const { data, error } = await supabase
      .functions
      .invoke('export-analytics-report', {
        body: { site_id: siteId, format }
      });

    if (error) throw error;
    return data.download_url;
  }
}