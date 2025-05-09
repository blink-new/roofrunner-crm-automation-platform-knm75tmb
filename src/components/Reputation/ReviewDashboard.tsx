import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Filter, Download, Search, 
  TrendingUp, MessageSquare, QrCode, 
  BarChart2, ArrowUp, ArrowDown, Calendar,
  AlertCircle, Zap
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import DashboardOverview from './DashboardOverview';
import TrendsChart from './TrendsChart';
import { ReputationService } from '../../lib/services/ReputationService';

export default function ReviewDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [platforms, setPlatforms] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, platformsData] = await Promise.all([
        ReputationService.getReviewStats(),
        ReputationService.getConnectedPlatforms()
      ]);
      
      setStats(statsData);
      setPlatforms(platformsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      // Implement export functionality
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1>Reviews & Reputation</h1>
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1>Reviews & Reputation</h1>
          <button
            onClick={() => loadData()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={24} />
            <div>
              <h3 className="font-medium">Error Loading Dashboard</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation', active: true }
            ]}
          />
          <h1 className="mt-2">Reviews & Reputation</h1>
        </div>
        
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

      <DashboardOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Review Trends</h3>
          <TrendsChart data={stats.trends} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Platform Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(stats.by_platform || {}).map(([platform, data]: [string, any]) => (
              <div key={platform}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img 
                      src={`/icons/${platform.toLowerCase()}.svg`} 
                      alt={platform} 
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/icons/default-platform.svg';
                      }}
                    />
                    <span className="text-sm font-medium capitalize">{platform}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < data.average_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{data.average_rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({data.total_reviews})</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${(data.average_rating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/reputation/campaigns/new')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <MessageSquare size={16} className="inline-block mr-2 text-primary-500" />
              Create Review Campaign
            </button>
            <button
              onClick={() => navigate('/reputation/feed')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <Star size={16} className="inline-block mr-2 text-primary-500" />
              View Review Feed
            </button>
            <button
              onClick={() => navigate('/reputation/analyzer')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <Zap size={16} className="inline-block mr-2 text-primary-500" />
              AI Review Analyzer
            </button>
            <button
              onClick={() => navigate('/reputation/competitors')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <TrendingUp size={16} className="inline-block mr-2 text-primary-500" />
              Competitor Monitor
            </button>
            <button
              onClick={() => navigate('/reputation/templates')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <MessageSquare size={16} className="inline-block mr-2 text-primary-500" />
              Manage Templates
            </button>
            <button
              onClick={() => navigate('/reputation/widgets')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <BarChart2 size={16} className="inline-block mr-2 text-primary-500" />
              Create Review Widget
            </button>
            <button
              onClick={() => navigate('/reputation/settings')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
            >
              <QrCode size={16} className="inline-block mr-2 text-primary-500" />
              Generate QR Codes
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Reviews</h3>
          {stats.recent_reviews && stats.recent_reviews.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_reviews.slice(0, 3).map((review: any) => (
                <div key={review.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{review.author_name}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{review.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 capitalize">{review.platform}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <button
                  onClick={() => navigate('/reputation/feed')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View all reviews
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recent reviews found
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Upcoming Campaigns</h3>
          {stats.upcoming_campaigns && stats.upcoming_campaigns.length > 0 ? (
            <div className="space-y-3">
              {stats.upcoming_campaigns.map((campaign: any) => (
                <div key={campaign.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{campaign.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(campaign.scheduled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {campaign.recipient_count} recipients
                  </span>
                </div>
              ))}
              <div className="text-center pt-2">
                <button
                  onClick={() => navigate('/reputation/campaigns')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View all campaigns
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No upcoming campaigns
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}