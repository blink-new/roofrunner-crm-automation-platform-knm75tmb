import { supabase } from '../supabase';
import type { ChecklistTemplate, ChecklistItem } from '../../types/jobs';

export class ChecklistService {
  static async getTemplates(): Promise<ChecklistTemplate[]> {
    const { data, error } = await supabase
      .from('checklist_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createTemplate(template: Omit<ChecklistTemplate, 'id' | 'created_at'>): Promise<ChecklistTemplate> {
    const { data, error } = await supabase
      .from('checklist_templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getChecklistItems(jobId: string): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('job_id', jobId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createChecklistItem(item: Omit<ChecklistItem, 'id'>): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from('checklist_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from('checklist_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteChecklistItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('checklist_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async reorderChecklistItems(items: { id: string; position: number }[]): Promise<void> {
    const { error } = await supabase
      .from('checklist_items')
      .upsert(
        items.map(({ id, position }) => ({
          id,
          position
        }))
      );

    if (error) throw error;
  }
}