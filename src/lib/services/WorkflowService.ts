import { supabase } from '../supabase';
import type { Workflow, Node, Edge } from '../../types/automations';

export class WorkflowService {
  static async getWorkflows(folderId?: string): Promise<Workflow[]> {
    let query = supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (folderId) {
      query = query.eq('folder_id', folderId);
    } else {
      query = query.is('folder_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getWorkflow(id: string): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at' | 'version'>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .insert([{
        ...workflow,
        version: 1
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async cloneWorkflow(id: string): Promise<Workflow> {
    const { data, error } = await supabase
      .functions
      .invoke('clone-workflow', {
        body: { workflow_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async publish(id: string, published: boolean): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .update({ published })
      .eq('id', id);

    if (error) throw error;
  }

  static async updateTrigger(
    workflowId: string,
    nodeId: string,
    data: Record<string, any>
  ): Promise<void> {
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('nodes')
      .eq('id', workflowId)
      .single();

    if (fetchError) throw fetchError;

    const updatedNodes = workflow.nodes.map((node: Node) =>
      node.id === nodeId ? { ...node, data } : node
    );

    const { error: updateError } = await supabase
      .from('workflows')
      .update({ nodes: updatedNodes })
      .eq('id', workflowId);

    if (updateError) throw updateError;
  }

  static async updateAction(
    workflowId: string,
    nodeId: string,
    data: Record<string, any>
  ): Promise<void> {
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('nodes')
      .eq('id', workflowId)
      .single();

    if (fetchError) throw fetchError;

    const updatedNodes = workflow.nodes.map((node: Node) =>
      node.id === nodeId ? { ...node, data } : node
    );

    const { error: updateError } = await supabase
      .from('workflows')
      .update({ nodes: updatedNodes })
      .eq('id', workflowId);

    if (updateError) throw updateError;
  }

  static async updateCanvasSettings(
    workflowId: string,
    settings: {
      zoom: number;
      position: { x: number; y: number };
      groups?: {
        id: string;
        name: string;
        nodes: string[];
        position: { x: number; y: number };
      }[];
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .update({ canvas_settings: settings })
      .eq('id', workflowId);

    if (error) throw error;
  }

  static async listPremiumActions(): Promise<any[]> {
    const { data, error } = await supabase
      .from('premium_actions')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async bulkEnable(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .update({ active: true })
      .in('id', ids);

    if (error) throw error;
  }

  static async bulkDisable(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .update({ active: false })
      .in('id', ids);

    if (error) throw error;
  }

  static async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .in('id', ids);

    if (error) throw error;
  }

  static async layoutConfig(id: string, config: any): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .update({ canvas_settings: config })
      .eq('id', id);

    if (error) throw error;
  }
}