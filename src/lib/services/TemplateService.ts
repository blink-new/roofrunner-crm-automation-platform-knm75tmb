import { supabase } from '../supabase';
import type { Template } from '../../types/marketing';

export class TemplateService {
  static async getTemplates(type?: string): Promise<Template[]> {
    let query = supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getTemplate(id: string): Promise<Template> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createTemplate(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async duplicateTemplate(id: string): Promise<Template> {
    const { data: original, error: fetchError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { data: duplicate, error: insertError } = await supabase
      .from('email_templates')
      .insert([{
        ...original,
        id: undefined,
        name: `${original.name} (Copy)`,
        created_at: undefined,
        updated_at: undefined
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return duplicate;
  }
}