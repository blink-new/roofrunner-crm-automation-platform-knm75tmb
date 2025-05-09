import { supabase } from '../supabase';

export class BufferService {
  static async getBufferRules(calendarId: string) {
    const { data, error } = await supabase
      .from('calendar_buffer_rules')
      .select(`
        *,
        service:calendar_services(*)
      `)
      .eq('calendar_id', calendarId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createBufferRule(rule: {
    calendar_id: string;
    service_id: string;
    buffer_before: number;
    buffer_after: number;
    applies_to: 'all' | 'specific_days';
    days?: number[];
  }) {
    const { data, error } = await supabase
      .from('calendar_buffer_rules')
      .insert([rule])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBufferRule(
    id: string,
    updates: Partial<{
      buffer_before: number;
      buffer_after: number;
      applies_to: 'all' | 'specific_days';
      days: number[];
    }>
  ) {
    const { data, error } = await supabase
      .from('calendar_buffer_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBufferRule(id: string) {
    const { error } = await supabase
      .from('calendar_buffer_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}