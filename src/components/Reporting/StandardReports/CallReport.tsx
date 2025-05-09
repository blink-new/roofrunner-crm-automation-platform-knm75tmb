import React, { useState, useEffect } from 'react';
import { Phone, Filter, Download, Search, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/card';
import { CallReportService } from '../../../lib/services/CallReportService';

export default function CallReport() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [filters, setFilters] = useState<{
    dateRange?: { start: string; end: string };
    direction?: 'inbound' | 'outbound' | 'all';
    duration?: { min?: number; max?: number };
    agents?: string[];
  }>({});

  useEffect(() => {
    loadData();
  }, [timeRange, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const reportData = await CallReportService.list(filters);
      setData(reportData);
    } catch (error) {
      console.error('Error loading call report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      // Implement export functionality
      alert(`Exporting call report as ${format}...`);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Call Report</h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="year_to_date">Year to date</option>
          </select>
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search calls..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button className="btn btn-secondary inline-flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button 
            onClick={loadData}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading call data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No call data found
                  </td>
                </tr>
              ) : (
                data.map((call, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(call.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        call.direction === 'inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {call.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {call.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.contact_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {call.agent_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        call.status === 'completed' ? 'bg-green-100 text-green-800' :
                        call.status === 'missed' ? 'bg-red-100 text-red-800' :
                        call.status === 'voicemail' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Call Volume by Day</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Call volume chart will be displayed here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Call Distribution by Agent</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Agent distribution chart will be displayed here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}