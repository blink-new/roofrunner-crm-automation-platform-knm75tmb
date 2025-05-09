import { supabase } from '../supabase';

export class CalendarSyncService {
  static async getConnectedCalendars() {
    const { data, error } = await supabase
      .from('calendar_connections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async connectCalendar(connection: {
    provider: 'google' | 'outlook';
    email: string;
    access_token: string;
    refresh_token: string;
    calendars: string[];
  }) {
    const { data, error } = await supabase
      .from('calendar_connections')
      .insert([connection])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async disconnectCalendar(id: string) {
    const { error } = await supabase
      .from('calendar_connections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async syncCalendar(id: string) {
    const { data, error } = await supabase
      .functions
      .invoke('sync-calendar', {
        body: { connection_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async updateCalendarSelection(id: string, calendars: string[]) {
    const { data, error } = await supabase
      .from('calendar_connections')
      .update({ calendars })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}