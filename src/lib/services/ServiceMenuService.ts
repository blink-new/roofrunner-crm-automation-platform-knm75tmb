import { supabase } from '../supabase';

export class ServiceMenuService {
  static async getServices() {
    const { data, error } = await supabase
      .from('calendar_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createService(service: {
    name: string;
    duration: number;
    description?: string;
    price?: number;
    max_seats?: number;
    color?: string;
    buffer_before?: number;
    buffer_after?: number;
  }) {
    const { data, error } = await supabase
      .from('calendar_services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateService(
    id: string,
    updates: Partial<{
      name: string;
      duration: number;
      description: string;
      price: number;
      max_seats: number;
      color: string;
      buffer_before: number;
      buffer_after: number;
    }>
  ) {
    const { data, error } = await supabase
      .from('calendar_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteService(id: string) {
    const { error } = await supabase
      .from('calendar_services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}