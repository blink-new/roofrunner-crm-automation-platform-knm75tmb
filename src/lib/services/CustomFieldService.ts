import { supabase } from '../supabase';

export class CustomFieldService {
  static async getCustomFields(objectType: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('object_type', objectType)
      .order('folder', { ascending: true })
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createCustomField(field: {
    object_type: string;
    name: string;
    type: string;
    folder?: string;
    required?: boolean;
    options?: string[];
  }): Promise<any> {
    const { data, error } = await supabase
      .from('custom_fields')
      .insert([field])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCustomField(
    id: string,
    updates: Partial<{
      name: string;
      folder: string;
      required: boolean;
      options: string[];
    }>
  ): Promise<any> {
    const { data, error } = await supabase
      .from('custom_fields')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCustomField(id: string): Promise<void> {
    const { error } = await supabase
      .from('custom_fields')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}