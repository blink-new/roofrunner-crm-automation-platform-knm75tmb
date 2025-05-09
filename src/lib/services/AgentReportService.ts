import { supabase } from '../supabase';

export class AgentReportService {
  static async list(filters?: {
    dateRange?: { start: string; end: string };
    agents?: string[];
    metrics?: string[];
  }): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('agent-report', {
        body: { filters }
      });

    if (error) throw error;
    return data;
  }

  static async getPerformanceMetrics(agentId: string, timeRange: string = 'last_30_days'): Promise<any> {
    const { data, error } = await supabase
      .functions
      .invoke('agent-performance', {
        body: { agent_id: agentId, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }

  static async getLeaderboard(metric: string, timeRange: string = 'last_30_days'): Promise<any[]> {
    const { data, error } = await supabase
      .functions
      .invoke('agent-leaderboard', {
        body: { metric, time_range: timeRange }
      });

    if (error) throw error;
    return data;
  }
}