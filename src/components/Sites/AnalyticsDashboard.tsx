import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart2, TrendingUp, Users, Clock, 
  Download, Filter, Calendar, Globe, Smartphone, 
  Laptop, ArrowUp, ArrowDown
} from 'lucide-react';
import { Card } from '../ui/card';
import { AnalyticsService } from '../../lib/services/AnalyticsService';

export default function AnalyticsDashboard() {
  const { siteId, funnelId } = useParams();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last_30_days');

  useEffect(() => {
    loadStats();
  }, [siteId, funnelId, timeRange]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      if (funnelId) {
        const data = await AnalyticsService.getFunnelAnalytics(funnelId, timeRange);
        setStats(data);
      } else if (siteId) {
        const data = await AnalyticsService.getSiteAnalytics(siteId, timeRange);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const downloadUrl = await AnalyticsService.exportAnalyticsReport(siteId!, format);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1>Analytics Dashboard</h1>
          <div className="flex gap-2">
            <select
              className="rounded-md border-gray-300"
              disabled
            >
              <option>Last 30 days</option>
            </select>
            <button
              className="btn btn-secondary inline-flex items-center gap-2"
              disabled
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Analytics Dashboard</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              {stats.visitors_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.visitors || 0}</h3>
          <p className="text-gray-600 text-sm">Total Visitors</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BarChart2 size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              {stats.pageviews_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.pageviews || 0}</h3>
          <p className="text-gray-600 text-sm">Page Views</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              {stats.conversion_rate_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.conversion_rate || '0%'}</h3>
          <p className="text-gray-600 text-sm">Conversion Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock size={20} />
            </div>
            <span className="text-sm text-red-600 font-medium flex items-center">
              <ArrowDown size={16} className="mr-1" />
              {stats.avg_time_change || '0%'}
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.avg_time || '0s'}</h3>
          <p className="text-gray-600 text-sm">Avg. Time on Site</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Traffic Over Time</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Traffic chart will be displayed here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Traffic Sources</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Traffic sources chart will be displayed here</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Device Breakdown</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <Smartphone size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">{stats.devices?.mobile || '0%'}</p>
              <p className="text-sm text-gray-500">Mobile</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Tablet size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">{stats.devices?.tablet || '0%'}</p>
              <p className="text-sm text-gray-500">Tablet</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Laptop size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">{stats.devices?.desktop || '0%'}</p>
              <p className="text-sm text-gray-500">Desktop</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Top Pages</h3>
          <div className="space-y-2">
            {(stats.top_pages || []).map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                  <span className="text-sm">{page.path}</span>
                </div>
                <span className="text-sm font-medium">{page.views} views</span>
              </div>
            ))}
            {(stats.top_pages || []).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No page data available
              </div>
            )}
          </div>
        </Card>
      </div>

      {funnelId && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Funnel Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Funnel Conversion Rate</span>
              <span className="text-lg font-bold">{stats.funnel_conversion_rate || '0%'}</span>
            </div>
            
            <div className="space-y-2">
              {(stats.funnel_steps || []).map((step: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{step.name}</span>
                    <span className="font-medium">{step.conversion_rate}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: step.completion_rate }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Tablet icon component since it's not in lucide-react
function Tablet({ size = 24, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}