import { supabase } from '../supabase';

export class ExportService {
  static async exportReport(
    reportId: string,
    format: 'pdf' | 'csv' | 'xlsx',
    filters?: Record<string, any>
  ): Promise<{ download_url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('export-report', {
        body: { report_id: reportId, format, filters }
      });

    if (error) throw error;
    return data;
  }

  static async exportWidget(
    widgetId: string,
    format: 'pdf' | 'csv' | 'xlsx' | 'png'
  ): Promise<{ download_url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('export-widget', {
        body: { widget_id: widgetId, format }
      });

    if (error) throw error;
    return data;
  }

  static async exportDrilldown(
    widgetId: string,
    drilldownParams: Record<string, any>,
    format: 'pdf' | 'csv' | 'xlsx'
  ): Promise<{ download_url: string }> {
    const { data, error } = await supabase
      .functions
      .invoke('export-drilldown', {
        body: { widget_id: widgetId, drilldown_params: drilldownParams, format }
      });

    if (error) throw error;
    return data;
  }
}