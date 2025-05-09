import { supabase } from '../supabase';
import type { WorkflowStats } from '../../types/automations';

export class LogService {
  static async getWorkflowLogs(workflowId: string, timeRange: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getWorkflowStats(workflowId: string, timeRange: string): Promise<WorkflowStats> {
    const { data, error } = await supabase
      .functions
      .invoke('workflow-stats', {
        body: {
          workflow_id: workflowId,
          time_range: timeRange
        }
      });

    if (error) throw error;
    return data;
  }

  static async getExecutionLogs(executionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('workflow_execution_logs')
      .select('*')
      .eq('execution_id', executionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data;
  }

  static streamLogs(executionId: string, callback: (log: any) => void): () => void {
    const channel = supabase
      .channel(`execution-${executionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'workflow_execution_logs',
        filter: `execution_id=eq.${executionId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}