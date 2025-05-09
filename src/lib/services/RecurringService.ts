import { supabase } from '../supabase';
import type { RecurringTask } from '../../types/jobs';

export class RecurringService {
  static async getRecurringTasks(): Promise<RecurringTask[]> {
    const { data, error } = await supabase
      .from('recurring_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createRecurringTask(task: Omit<RecurringTask, 'id' | 'created_at'>): Promise<RecurringTask> {
    const { data, error } = await supabase
      .from('recurring_tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRecurringTask(id: string, updates: Partial<RecurringTask>): Promise<RecurringTask> {
    const { data, error } = await supabase
      .from('recurring_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteRecurringTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('recurring_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}