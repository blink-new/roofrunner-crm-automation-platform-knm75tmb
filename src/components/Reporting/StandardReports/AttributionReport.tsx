import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, Download, Search, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/card';
import { AttributionService } from '../../../lib/services/AttributionService';

export default function AttributionReport() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [filters, setFilters] = useState<{
    dateRange?: { start: string; end: string };
    sources?: string[];
    campaigns?: string[];
  }>({});

  useEffect(() => {
    loadData();
  }, [timeRange, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const reportData = await AttributionService.list(filters);
      setData(reportData);
    } catch (error) {
      console.error('Error loading attribution report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      // Implement export functionality
      alert(`Exporting attribution report as ${format}...`);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Attribution Report</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Leads</h3>
            <span className="text-2xl font-bold">95</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full mb-2">
            <div className="h-1 bg-primary-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>+12% vs last period</span>
            <span>Target: 100</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Conversions</h3>
            <span className="text-2xl font-bold">42</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full mb-2">
            <div className="h-1 bg-green-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>+8% vs last period</span>
            <span>Target: 70</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Cost Per Lead</h3>
            <span className="text-2xl font-bold">$32.50</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full mb-2">
            <div className="h-1 bg-yellow-500 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>-5% vs last period</span>
            <span>Target: $25.00</span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search sources or campaigns..."
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
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Per Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading attribution data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No attribution data found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.campaign}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.leads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.conversion_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.cost_per_lead.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.roi}%
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
          <h3 className="text-lg font-medium mb-4">Source Distribution</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Source distribution chart will be displayed here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Conversion Journey</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Conversion journey chart will be displayed here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}