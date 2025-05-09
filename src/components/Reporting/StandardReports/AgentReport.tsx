import React, { useState, useEffect } from 'react';
import { BarChart, DollarSign, Users, TrendingUp, ArrowUp } from 'lucide-react';
import { Card } from '../../ui/card';
import { AgentReportService } from '../../../lib/services/AgentReportService';

export default function AgentReport() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [filters, setFilters] = useState<{
    dateRange?: { start: string; end: string };
    agents?: string[];
    metrics?: string[];
  }>({});

  useEffect(() => {
    loadData();
  }, [timeRange, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const reportData = await AgentReportService.list(filters);
      setData(reportData);
    } catch (error) {
      console.error('Error loading agent report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      // Implement export functionality
      alert(`Exporting agent report as ${format}...`);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Agent Performance</h1>
        <p className="text-gray-600">Track and analyze your team's performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-2xl font-bold">2,543</h3>
          <p className="text-gray-600 text-sm">Total Calls</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BarChart size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              8%
            </span>
          </div>
          <h3 className="text-2xl font-bold">32.5%</h3>
          <p className="text-gray-600 text-sm">Conversion Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              15%
            </span>
          </div>
          <h3 className="text-2xl font-bold">24.8%</h3>
          <p className="text-gray-600 text-sm">Deals Closed</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              24%
            </span>
          </div>
          <h3 className="text-2xl font-bold">$12.5k</h3>
          <p className="text-gray-600 text-sm">Revenue Generated</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calls
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Deal Size
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading agent data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No agent data found
                  </td>
                </tr>
              ) : (
                data.map((agent, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {agent.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.calls}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.appointments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.deals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${agent.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.conversion_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${agent.avg_deal_size.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Agent Leaderboard</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Agent leaderboard chart will be displayed here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Performance trends chart will be displayed here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}