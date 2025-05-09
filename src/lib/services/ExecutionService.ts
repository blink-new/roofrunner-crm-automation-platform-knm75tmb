import { supabase } from '../supabase';
import type { WorkflowExecution } from '../../types/automations';

export class ExecutionService {
  static async getExecutions(workflowId: string): Promise<WorkflowExecution[]> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getExecution(id: string): Promise<WorkflowExecution> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async test(workflowId: string, testData: Record<string, any>): Promise<WorkflowExecution> {
    const { data, error } = await supabase
      .functions
      .invoke('test-workflow', {
        body: {
          workflow_id: workflowId,
          test_data: testData
        }
      });

    if (error) throw error;
    return data;
  }

  static async executeManual(workflowId: string, recordId: string): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('execute-workflow', {
        body: {
          workflow_id: workflowId,
          trigger_type: 'manual',
          record_id: recordId
        }
      });

    if (error) throw error;
  }
}