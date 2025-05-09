import { supabase } from '../supabase';

export class ScheduleService {
  static async scheduleReport(
    reportId: string,
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      time?: string;
      day?: number;
      recipients: string[];
      format: 'pdf' | 'csv';
    }
  ): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('schedule-report', {
        body: { report_id: reportId, schedule }
      });

    if (error) throw error;
    return data;
  }

  static async getSchedules(reportId?: string): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('get-report-schedules', {
        body: { report_id: reportId }
      });

    if (error) throw error;
    return data;
  }

  static async updateSchedule(
    scheduleId: string,
    updates: Partial<{
      frequency: 'daily' | 'weekly' | 'monthly';
      time: string;
      day: number;
      recipients: string[];
      format: 'pdf' | 'csv';
      active: boolean;
    }>
  ): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('update-report-schedule', {
        body: { schedule_id: scheduleId, updates }
      });

    if (error) throw error;
    return data;
  }

  static async deleteSchedule(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('delete-report-schedule', {
        body: { schedule_id: scheduleId }
      });

    if (error) throw error;
  }
}