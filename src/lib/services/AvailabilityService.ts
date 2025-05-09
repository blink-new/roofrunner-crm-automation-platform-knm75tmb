import { supabase } from '../supabase';

export class AvailabilityService {
  static async getAvailability(resourceId: string) {
    const { data, error } = await supabase
      .from('calendar_availability')
      .select('*')
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateAvailability(
    resourceId: string,
    slots: {
      days: number[];
      start_time: string;
      end_time: string;
      type: 'available' | 'unavailable';
    }[]
  ) {
    // Delete existing slots
    await supabase
      .from('calendar_availability')
      .delete()
      .eq('resource_id', resourceId);

    // Insert new slots
    const { data, error } = await supabase
      .from('calendar_availability')
      .insert(
        slots.map(slot => ({
          resource_id: resourceId,
          ...slot
        }))
      )
      .select();

    if (error) throw error;
    return data;
  }

  static async checkAvailability(
    resourceId: string,
    start: string,
    end: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_resource_availability', {
        resource_id: resourceId,
        start_time: start,
        end_time: end
      });

    if (error) throw error;
    return data;
  }

  static async getBlockedDates(resourceId: string) {
    const { data, error } = await supabase
      .from('calendar_blocked_dates')
      .select('*')
      .eq('resource_id', resourceId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async addBlockedDate(
    resourceId: string,
    startDate: string,
    endDate: string,
    reason?: string
  ) {
    const { data, error } = await supabase
      .from('calendar_blocked_dates')
      .insert([{
        resource_id: resourceId,
        start_date: startDate,
        end_date: endDate,
        reason
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeBlockedDate(id: string) {
    const { error } = await supabase
      .from('calendar_blocked_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}