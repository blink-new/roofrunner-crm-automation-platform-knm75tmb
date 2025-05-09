import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { BarChart, Clock, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { WorkflowStats } from '../../types/automations';
import { LogService } from '../../lib/services/LogService';

interface StatsViewProps {
  workflowId: string;
}

export default function StatsView({ workflowId }: StatsViewProps) {
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadStats();
    loadLogs();
  }, [workflowId, timeRange]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await LogService.getWorkflowStats(workflowId, timeRange);
      setStats(data);
    } catch (error) {
      console.error('Error loading workflow stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await LogService.getWorkflowLogs(workflowId, timeRange);
      setLogs(data);
    } catch (error) {
      console.error('Error loading workflow logs:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-500">
            This workflow hasn't been executed yet or no data is available for the selected time range.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Workflow Statistics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={20} className="text-primary-500" />
              <h4 className="font-medium">Total Executions</h4>
            </div>
            <div className="text-3xl font-bold">{stats.total_runs}</div>
            {stats.last_run_at && (
              <div className="text-sm text-gray-500 mt-2">
                Last run: {new Date(stats.last_run_at).toLocaleString()}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} className="text-green-500" />
              <h4 className="font-medium">Success Rate</h4>
            </div>
            <div className="text-3xl font-bold">
              {stats.total_runs > 0
                ? `${Math.round((stats.successful_runs / stats.total_runs) * 100)}%`
                : 'N/A'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {stats.successful_runs} successful / {stats.failed_runs} failed
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-blue-500" />
              <h4 className="font-medium">Average Duration</h4>
            </div>
            <div className="text-3xl font-bold">
              {stats.avg_duration_ms ? `${(stats.avg_duration_ms / 1000).toFixed(2)}s` : 'N/A'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Per workflow execution
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Execution History</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No execution logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.started_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.trigger_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.completed_at
                          ? `${((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000).toFixed(2)}s`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary-600 hover:text-primary-700">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}