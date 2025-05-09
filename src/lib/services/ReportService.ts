import { supabase } from '../supabase';
import type { Report, ReportField, ReportFilter, ChartType } from '../../types/reporting';

export class ReportService {
  static async getReports(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getReport(id: string): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createReport(report: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteReport(id: string): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async exportReport(id: string, format: 'pdf' | 'csv'): Promise<string> {
    const { data, error } = await supabase
      .functions
      .invoke('export-report', {
        body: { report_id: id, format }
      });

    if (error) throw error;
    return data.download_url;
  }

  static async scheduleReport(id: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'csv';
  }): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .update({ schedule })
      .eq('id', id);

    if (error) throw error;
  }
}