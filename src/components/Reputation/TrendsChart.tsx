import React, { useState } from 'react';
import { Calendar, Star, MessageSquare } from 'lucide-react';

interface TrendsChartProps {
  data: {
    date: string;
    reviews: number;
    invites: number;
    average_rating: number;
  }[];
}

export default function TrendsChart({ data }: TrendsChartProps) {
  const [metric, setMetric] = useState<'reviews' | 'invites' | 'rating'>('reviews');
  
  const maxValue = Math.max(
    ...data.map(item => 
      metric === 'rating' 
        ? item.average_rating 
        : metric === 'reviews' 
          ? item.reviews 
          : item.invites
    )
  );
  
  const getBarHeight = (value: number) => {
    return `${(value / maxValue) * 100}%`;
  };
  
  const getBarColor = (value: number, index: number) => {
    if (metric === 'rating') {
      // Color based on rating
      if (value >= 4) return 'bg-green-500';
      if (value >= 3) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // Alternating colors for reviews and invites
      return index % 2 === 0 ? 'bg-primary-500' : 'bg-primary-400';
    }
  };

  return (
    <div className="h-64">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMetric('reviews')}
            className={`px-3 py-1 rounded-full text-sm ${
              metric === 'reviews' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <MessageSquare size={14} className="inline-block mr-1" />
            Reviews
          </button>
          <button
            onClick={() => setMetric('invites')}
            className={`px-3 py-1 rounded-full text-sm ${
              metric === 'invites' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Calendar size={14} className="inline-block mr-1" />
            Invites
          </button>
          <button
            onClick={() => setMetric('rating')}
            className={`px-3 py-1 rounded-full text-sm ${
              metric === 'rating' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Star size={14} className="inline-block mr-1" />
            Rating
          </button>
        </div>
      </div>
      
      <div className="flex items-end h-48 gap-1">
        {data.map((item, index) => {
          const value = metric === 'rating' 
            ? item.average_rating 
            : metric === 'reviews' 
              ? item.reviews 
              : item.invites;
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center group"
            >
              <div className="relative w-full">
                <div 
                  className={`w-full ${getBarColor(value, index)}`} 
                  style={{ 
                    height: getBarHeight(value),
                    minHeight: '4px'
                  }}
                ></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {metric === 'rating' ? value.toFixed(1) : value}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}