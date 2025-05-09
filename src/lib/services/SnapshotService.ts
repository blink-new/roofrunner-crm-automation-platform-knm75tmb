import { supabase } from '../supabase';

export class SnapshotService {
  static async getSnapshots(reportId?: string): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('get-report-snapshots', {
        body: { report_id: reportId }
      });

    if (error) throw error;
    return data;
  }

  static async createSnapshot(
    reportId: string,
    name: string,
    description?: string
  ): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('create-report-snapshot', {
        body: { report_id: reportId, name, description }
      });

    if (error) throw error;
    return data;
  }

  static async getTemplates(category?: string): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('get-report-templates', {
        body: { category }
      });

    if (error) throw error;
    return data;
  }

  static async applyTemplate(
    reportId: string,
    templateId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('apply-report-template', {
        body: { report_id: reportId, template_id: templateId }
      });

    if (error) throw error;
    return data;
  }
}