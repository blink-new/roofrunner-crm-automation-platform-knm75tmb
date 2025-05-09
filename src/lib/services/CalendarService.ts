import { supabase } from '../supabase';

export class CalendarService {
  static async getCalendars() {
    const { data, error } = await supabase
      .from('calendars')
      .select(`
        *,
        team_members:calendar_team_members(user_id),
        working_hours:calendar_working_hours(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createCalendar(calendar: {
    name: string;
    type: 'personal' | 'collective' | 'resource';
    timezone: string;
    working_hours: {
      day: number;
      start: string;
      end: string;
    }[];
    team_members?: string[];
  }) {
    const { data, error } = await supabase
      .from('calendars')
      .insert([{
        name: calendar.name,
        type: calendar.type,
        timezone: calendar.timezone
      }])
      .select()
      .single();

    if (error) throw error;

    // Add working hours
    const { error: hoursError } = await supabase
      .from('calendar_working_hours')
      .insert(
        calendar.working_hours.map(hours => ({
          calendar_id: data.id,
          ...hours
        }))
      );

    if (hoursError) throw hoursError;

    // Add team members for collective calendars
    if (calendar.type === 'collective' && calendar.team_members?.length) {
      const { error: membersError } = await supabase
        .from('calendar_team_members')
        .insert(
          calendar.team_members.map(userId => ({
            calendar_id: data.id,
            user_id: userId
          }))
        );

      if (membersError) throw membersError;
    }

    return data;
  }

  static async updateCalendar(
    id: string,
    updates: {
      name?: string;
      timezone?: string;
      working_hours?: {
        day: number;
        start: string;
        end: string;
      }[];
      team_members?: string[];
    }
  ) {
    const { data, error } = await supabase
      .from('calendars')
      .update({
        name: updates.name,
        timezone: updates.timezone
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (updates.working_hours) {
      // Delete existing hours
      await supabase
        .from('calendar_working_hours')
        .delete()
        .eq('calendar_id', id);

      // Add new hours
      const { error: hoursError } = await supabase
        .from('calendar_working_hours')
        .insert(
          updates.working_hours.map(hours => ({
            calendar_id: id,
            ...hours
          }))
        );

      if (hoursError) throw hoursError;
    }

    if (updates.team_members) {
      // Delete existing members
      await supabase
        .from('calendar_team_members')
        .delete()
        .eq('calendar_id', id);

      // Add new members
      const { error: membersError } = await supabase
        .from('calendar_team_members')
        .insert(
          updates.team_members.map(userId => ({
            calendar_id: id,
            user_id: userId
          }))
        );

      if (membersError) throw membersError;
    }

    return data;
  }

  static async deleteCalendar(id: string) {
    const { error } = await supabase
      .from('calendars')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}