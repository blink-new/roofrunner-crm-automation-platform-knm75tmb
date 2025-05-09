import { supabase } from '../supabase';
import type { WorkflowFolder } from '../../types/automations';

export class FolderService {
  static async getFolders(): Promise<WorkflowFolder[]> {
    const { data, error } = await supabase
      .from('workflow_folders')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async createFolder(folder: Omit<WorkflowFolder, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<WorkflowFolder> {
    const { data, error } = await supabase
      .from('workflow_folders')
      .insert([folder])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFolder(id: string, updates: Partial<WorkflowFolder>): Promise<WorkflowFolder> {
    const { data, error } = await supabase
      .from('workflow_folders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteFolder(id: string): Promise<void> {
    // First update any workflows in this folder to have no folder
    const { error: updateError } = await supabase
      .from('workflows')
      .update({ folder_id: null })
      .eq('folder_id', id);

    if (updateError) throw updateError;

    // Then delete the folder
    const { error } = await supabase
      .from('workflow_folders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async moveWorkflowToFolder(workflowId: string, folderId?: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .update({ folder_id: folderId })
      .eq('id', workflowId);

    if (error) throw error;
  }
}