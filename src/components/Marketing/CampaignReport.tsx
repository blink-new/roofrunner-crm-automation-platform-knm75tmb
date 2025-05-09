import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart2, ArrowUp, ArrowDown, Download, 
  Mail, MessageSquare, Users, Clock, Filter 
} from 'lucide-react';
import { Card } from '../ui/card';
import { CampaignService } from '../../lib/services/CampaignService';
import { AnalyticsService } from '../../lib/services/AnalyticsService';

export default function CampaignReport() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    if (id) {
      loadCampaign();
      loadStats();
    }
  }, [id, timeRange]);

  const loadCampaign = async () => {
    try {
      const data = await CampaignService.getCampaign(id!);
      setCampaign(data);
    } catch (error) {
      console.error('Error loading campaign:', error);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await AnalyticsService.getCampaignStats(id!);
      setStats(data);
    } catch (error) {
      console.error('Error loading campaign stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const downloadUrl = await AnalyticsService.exportCampaignReport(id!, format);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (!campaign || !stats) {
    return (
      <div className="space-y-6">
        <h1>Campaign Report</h1>
        <Card className="p-6">
          <div className="text-center py-8">
            {loading ? 'Loading campaign data...' : 'Campaign not found'}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Campaign Report: {campaign.name}</h1>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <Mail size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              {stats.sent_rate_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.sent || 0}</h3>
          <p className="text-gray-600 text-sm">Total Sent</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Mail size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              {stats.open_rate_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.open_rate || '0%'}</h3>
          <p className="text-gray-600 text-sm">Open Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              {stats.click_rate_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.click_rate || '0%'}</h3>
          <p className="text-gray-600 text-sm">Click Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-sm text-red-600 font-medium flex items-center">
              <ArrowDown size={16} className="mr-1" />
              {stats.unsubscribe_rate_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.unsubscribe_rate || '0%'}</h3>
          <p className="text-gray-600 text-sm">Unsubscribe Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Engagement chart will be displayed here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Click Distribution</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Click distribution chart will be displayed here</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Top Performing Links</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Click Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(stats.top_links || []).map((link: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {link.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {link.unique_clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {link.click_rate}
                  </td>
                </tr>
              ))}
              {(stats.top_links || []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No link data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}