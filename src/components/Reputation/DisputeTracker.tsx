import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, Filter, Flag, 
  AlertTriangle, CheckCircle, Clock, 
  X, Plus, FileText
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { ReputationService } from '../../lib/services/ReputationService';

export default function DisputeTracker() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [newDispute, setNewDispute] = useState({
    review_id: '',
    platform: 'google',
    reason: '',
    evidence: ''
  });
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [disputesData, reviewsData] = await Promise.all([
        ReputationService.getDisputes(),
        ReputationService.getReviews({ rating: [1, 2] }) // Load low-rated reviews for dispute creation
      ]);
      
      setDisputes(disputesData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    try {
      await ReputationService.createDispute(newDispute);
      setShowNewDispute(false);
      setNewDispute({
        review_id: '',
        platform: 'google',
        reason: '',
        evidence: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating dispute:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, notes?: string) => {
    try {
      await ReputationService.updateDisputeStatus(id, status, notes);
      setDisputes(disputes.map(dispute => 
        dispute.id === id ? { ...dispute, status, notes, updated_at: new Date().toISOString() } : dispute
      ));
    } catch (error) {
      console.error('Error updating dispute status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <X size={16} className="text-red-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        dispute.reason.toLowerCase().includes(searchLower) ||
        dispute.evidence.toLowerCase().includes(searchLower)
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
              { label: 'Dispute Tracker', path: '/reputation/disputes', active: true }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/reputation')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>Dispute Tracker</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowNewDispute(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Dispute</span>
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
                  placeholder="Search disputes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {showNewDispute && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium mb-4">Create New Dispute</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Review to Dispute
                </label>
                <select
                  value={newDispute.review_id}
                  onChange={(e) => {
                    const review = reviews.find(r => r.id === e.target.value);
                    setNewDispute({
                      ...newDispute,
                      review_id: e.target.value,
                      platform: review ? review.platform : 'google'
                    });
                  }}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Select a review...</option>
                  {reviews.map(review => (
                    <option key={review.id} value={review.id}>
                      {review.author_name} - {review.rating} ★ - {new Date(review.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Dispute
                </label>
                <select
                  value={newDispute.reason}
                  onChange={(e) => setNewDispute({ ...newDispute, reason: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Select a reason...</option>
                  <option value="fake_review">Fake or Spam Review</option>
                  <option value="offensive_content">Offensive Content</option>
                  <option value="not_customer">Not a Customer</option>
                  <option value="conflict_of_interest">Conflict of Interest</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence
                </label>
                <textarea
                  value={newDispute.evidence}
                  onChange={(e) => setNewDispute({ ...newDispute, evidence: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={4}
                  placeholder="Provide detailed evidence to support your dispute..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Be specific and provide as much evidence as possible to support your case.
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewDispute(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDispute}
                  className="btn btn-primary"
                  disabled={!newDispute.review_id || !newDispute.reason || !newDispute.evidence}
                >
                  Submit Dispute
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
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
          ) : filteredDisputes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No disputes found. Create your first dispute to get started.
            </div>
          ) : (
            filteredDisputes.map(dispute => (
              <div key={dispute.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Flag size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{dispute.platform} Review Dispute</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                          {dispute.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(dispute.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium">Reason: </span>
                      <span className="text-sm">{dispute.reason.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm font-medium">Evidence: </span>
                      <p className="text-sm text-gray-600">{dispute.evidence}</p>
                    </div>
                    
                    {dispute.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(dispute.id, 'cancelled', 'Cancelled by user')}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel Dispute
                        </button>
                        <button
                          className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                        >
                          <FileText size={14} />
                          <span>View Details</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {getStatusIcon(dispute.status)}
                        <span>
                          {dispute.status === 'approved' 
                            ? 'Dispute approved' 
                            : dispute.status === 'rejected'
                            ? 'Dispute rejected'
                            : 'Status updated'
                          }
                          {dispute.updated_at && ` on ${new Date(dispute.updated_at).toLocaleDateString()}`}
                        </span>
                        {dispute.notes && (
                          <span className="ml-2">- {dispute.notes}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}