import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Star, MessageSquare, 
  Flag, Copy, Trash2, Calendar, Download, 
  CheckSquare, RefreshCw
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import ReviewReplyModal from './ReviewReplyModal';
import { ReputationService } from '../../lib/services/ReputationService';
import { BulkActionService } from '../../lib/services/BulkActionService';

export default function ReviewFeed() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    platform: string[];
    rating: number[];
    dateRange: {
      start: Date;
      end: Date;
    } | null;
    status: string | null;
  }>({
    platform: [],
    rating: [],
    dateRange: null,
    status: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [filters]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      const filterParams: any = {};
      
      if (filters.platform.length > 0) {
        filterParams.platform = filters.platform;
      }
      
      if (filters.rating.length > 0) {
        filterParams.rating = filters.rating;
      }
      
      if (filters.dateRange) {
        filterParams.dateRange = filters.dateRange;
      }
      
      if (filters.status) {
        filterParams.status = filters.status;
      }
      
      const data = await ReputationService.getReviews(filterParams);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review: any) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleSaveReply = async (reply: string) => {
    if (!selectedReview) return;
    
    try {
      await ReputationService.replyToReview(selectedReview.id, reply);
      
      // Update the review in the list
      setReviews(reviews.map(review => 
        review.id === selectedReview.id 
          ? { ...review, response: reply, response_date: new Date().toISOString() } 
          : review
      ));
      
      setShowReplyModal(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error saving reply:', error);
    }
  };

  const handleFlagReview = async (id: string, reason: string) => {
    try {
      await ReputationService.flagReview(id, reason);
      
      // Update the review in the list
      setReviews(reviews.map(review => 
        review.id === id 
          ? { ...review, status: 'flagged', flag_reason: reason } 
          : review
      ));
    } catch (error) {
      console.error('Error flagging review:', error);
    }
  };

  const handleBulkAction = async (action: 'export' | 'delete') => {
    if (selectedReviews.length === 0) return;
    
    if (action === 'export') {
      try {
        const result = await BulkActionService.bulkExportReviews(selectedReviews, 'csv');
        window.open(result.download_url, '_blank');
      } catch (error) {
        console.error('Error exporting reviews:', error);
      }
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedReviews.length} reviews?`)) {
        try {
          await BulkActionService.bulkDeleteReviews(selectedReviews);
          setReviews(reviews.filter(review => !selectedReviews.includes(review.id)));
          setSelectedReviews([]);
        } catch (error) {
          console.error('Error deleting reviews:', error);
        }
      }
    }
  };

  const handleSyncReviews = async () => {
    try {
      setIsSyncing(true);
      await ReputationService.syncReviews();
      await loadReviews();
    } catch (error) {
      console.error('Error syncing reviews:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        review.author_name.toLowerCase().includes(searchLower) ||
        review.content.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation' },
              { label: 'Review Feed', path: '/reputation/feed', active: true }
            ]}
          />
          <h1 className="mt-2">Review Feed</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSyncReviews}
            className="btn btn-secondary inline-flex items-center gap-2"
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Reviews'}</span>
          </button>
          
          <button
            onClick={() => navigate('/reputation/disputes')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Flag size={16} />
            <span>Disputes</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Platforms</h4>
                  <div className="space-y-1">
                    {['google', 'facebook', 'yelp'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.platform.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                platform: [...filters.platform, platform]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                platform: filters.platform.filter(p => p !== platform)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.rating.includes(rating)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                rating: [...filters.rating, rating]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                rating: filters.rating.filter(r => r !== rating)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                          {rating} <Star size={12} className="ml-1 text-yellow-400 fill-yellow-400" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 text-sm"
                        onChange={(e) => {
                          const start = e.target.value ? new Date(e.target.value) : null;
                          const end = filters.dateRange?.end || new Date();
                          
                          setFilters({
                            ...filters,
                            dateRange: start ? { start, end } : null
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 text-sm"
                        onChange={(e) => {
                          const end = e.target.value ? new Date(e.target.value) : null;
                          const start = filters.dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                          
                          setFilters({
                            ...filters,
                            dateRange: end ? { start, end } : null
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setFilters({
                      platform: [],
                      rating: [],
                      dateRange: null,
                      status: null
                    });
                  }}
                  className="btn btn-secondary mr-2"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedReviews.length > 0 && (
          <div className="bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedReviews.length} review(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="btn btn-secondary text-sm"
              >
                <Download size={14} className="mr-1" />
                Export
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn btn-secondary text-sm text-red-600 hover:text-red-700"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews found matching your criteria.
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReviews([...selectedReviews, review.id]);
                        } else {
                          setSelectedReviews(selectedReviews.filter(id => id !== review.id));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 mt-1"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    {review.author_image ? (
                      <img 
                        src={review.author_image} 
                        alt={review.author_name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {review.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-medium">{review.author_name}</span>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 capitalize">{review.platform}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{review.content}</p>
                    
                    {review.response && (
                      <div className="bg-gray-50 p-3 rounded-md mb-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <MessageSquare size={12} />
                          <span>Your response • {new Date(review.response_date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600">{review.response}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleReply(review)}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {review.response ? 'Edit Response' : 'Reply'}
                      </button>
                      <button
                        onClick={() => handleFlagReview(review.id, 'Inappropriate content')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Flag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {showReplyModal && selectedReview && (
        <ReviewReplyModal
          review={selectedReview}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReview(null);
          }}
          onSave={handleSaveReply}
        />
      )}
    </div>
  );
}