import React from 'react';
import { Star, MessageSquare, TrendingUp, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../ui/card';

interface DashboardOverviewProps {
  stats: {
    average_rating: number;
    total_reviews: number;
    rating_change: number;
    review_count_change: number;
    response_rate: number;
    response_rate_change: number;
    invite_count: number;
    invite_count_change: number;
    [key: string]: any;
  };
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
            <Star size={20} />
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${
              stats.rating_change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.rating_change >= 0 ? (
                <ArrowUp size={16} className="inline" />
              ) : (
                <ArrowDown size={16} className="inline" />
              )}
              {Math.abs(stats.rating_change).toFixed(1)}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</h3>
        <p className="text-gray-600 text-sm">Average Rating</p>
        <div className="mt-2 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < Math.round(stats.average_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
            />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <MessageSquare size={20} />
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${
              stats.review_count_change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.review_count_change >= 0 ? (
                <ArrowUp size={16} className="inline" />
              ) : (
                <ArrowDown size={16} className="inline" />
              )}
              {Math.abs(stats.review_count_change)}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold">{stats.total_reviews}</h3>
        <p className="text-gray-600 text-sm">Total Reviews</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${
              stats.response_rate_change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.response_rate_change >= 0 ? (
                <ArrowUp size={16} className="inline" />
              ) : (
                <ArrowDown size={16} className="inline" />
              )}
              {Math.abs(stats.response_rate_change)}%
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold">{stats.response_rate}%</h3>
        <p className="text-gray-600 text-sm">Response Rate</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Users size={20} />
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${
              stats.invite_count_change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.invite_count_change >= 0 ? (
                <ArrowUp size={16} className="inline" />
              ) : (
                <ArrowDown size={16} className="inline" />
              )}
              {Math.abs(stats.invite_count_change)}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold">{stats.invite_count}</h3>
        <p className="text-gray-600 text-sm">Review Invites Sent</p>
      </Card>
    </div>
  );
}