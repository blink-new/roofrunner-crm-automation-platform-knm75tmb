import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Calendar, Mail, 
  MessageSquare, BarChart2, Copy, Trash2, 
  Play, Pause, Download, CheckSquare
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { ReputationService } from '../../lib/services/ReputationService';
import { BulkActionService } from '../../lib/services/BulkActionService';

export default function ReviewCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await ReputationService.getReviewCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await ReputationService.updateReviewCampaign(id, { active: !currentActive });
      setCampaigns(campaigns.map(campaign => 
        campaign.id === id ? { ...campaign, active: !currentActive } : campaign
      ));
    } catch (error) {
      console.error('Error toggling campaign status:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const campaign = campaigns.find(c => c.id === id);
      if (!campaign) return;
      
      const newCampaign = {
        ...campaign,
        name: `${campaign.name} (Copy)`,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      };
      
      const result = await ReputationService.createReviewCampaign(newCampaign);
      setCampaigns([result, ...campaigns]);
    } catch (error) {
      console.error('Error duplicating campaign:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await ReputationService.deleteReviewCampaign(id);
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleBulkAction = async (action: 'export' | 'delete') => {
    if (selectedCampaigns.length === 0) return;
    
    if (action === 'export') {
      try {
        const result = await BulkActionService.bulkExportReviews(selectedCampaigns, 'csv');
        window.open(result.download_url, '_blank');
      } catch (error) {
        console.error('Error exporting campaigns:', error);
      }
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedCampaigns.length} campaigns?`)) {
        try {
          for (const id of selectedCampaigns) {
            await ReputationService.deleteReviewCampaign(id);
          }
          setCampaigns(campaigns.filter(campaign => !selectedCampaigns.includes(campaign.id)));
          setSelectedCampaigns([]);
        } catch (error) {
          console.error('Error deleting campaigns:', error);
        }
      }
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation' },
              { label: 'Campaigns', path: '/reputation/campaigns', active: true }
            ]}
          />
          <h1 className="mt-2">Review Campaigns</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/reputation/templates')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Mail size={16} />
            <span>Templates</span>
          </button>

          <button
            onClick={() => navigate('/reputation/campaigns/new')}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Campaign</span>
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
                  placeholder="Search campaigns..."
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

        {selectedCampaigns.length > 0 && (
          <div className="bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedCampaigns.length} campaign(s) selected
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

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="hover:shadow-md transition-shadow animate-pulse"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>

                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>

                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredCampaigns.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No campaigns found. Create your first review campaign to get started.
              </div>
            ) : (
              filteredCampaigns.map(campaign => (
                <Card
                  key={campaign.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                            } else {
                              setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {campaign.type === 'email' ? (
                              <Mail size={12} />
                            ) : (
                              <MessageSquare size={12} />
                            )}
                            <span className="capitalize">{campaign.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(campaign.id, campaign.active)}
                          className={`p-1 rounded-full ${
                            campaign.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}
                          title={campaign.active ? 'Pause campaign' : 'Activate campaign'}
                        >
                          {campaign.active ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Sent</span>
                        <p className="font-medium">{campaign.stats?.sent || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Opened</span>
                        <p className="font-medium">{campaign.stats?.opened || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Clicked</span>
                        <p className="font-medium">{campaign.stats?.clicked || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Reviews</span>
                        <p className="font-medium">{campaign.stats?.reviews || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/reputation/campaigns/${campaign.id}`)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit campaign"
                        >
                          <BarChart2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(campaign.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Duplicate campaign"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Delete campaign"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}