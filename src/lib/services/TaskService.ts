import { supabase } from '../supabase';
import type { Task } from '../../types/jobs';

export class TaskService {
  static async getTasks(filters?: {
    status?: string[];
    assignedTo?: string;
    priority?: string[];
    tags?: string[];
  }): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    if (filters?.priority?.length) {
      query = query.in('priority', filters.priority);
    }

    if (filters?.tags?.length) {
      query = query.contains('tags', filters.tags);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async bulkUpdate(
    ids: string[],
    updates: Partial<Task>
  ): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .in('id', ids);

    if (error) throw error;
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', ids);

    if (error) throw error;
  }
}