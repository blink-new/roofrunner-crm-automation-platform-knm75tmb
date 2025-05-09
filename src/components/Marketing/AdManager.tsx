import React, { useState, useEffect } from 'react';
import { DollarSign, BarChart2, Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { AdService } from '../../lib/services/AdService';

export default function AdManager() {
  const [adCampaigns, setAdCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: 'facebook',
    objective: 'awareness',
    budget: 0,
    budget_type: 'daily' as const,
    start_date: '',
    end_date: '',
    audience_id: ''
  });

  useEffect(() => {
    loadAdCampaigns();
  }, []);

  const loadAdCampaigns = async () => {
    try {
      setLoading(true);
      const data = await AdService.getAdCampaigns();
      setAdCampaigns(data);
    } catch (error) {
      console.error('Error loading ad campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      await AdService.createAdCampaign(newCampaign);
      setNewCampaign({
        name: '',
        platform: 'facebook',
        objective: 'awareness',
        budget: 0,
        budget_type: 'daily',
        start_date: '',
        end_date: '',
        audience_id: ''
      });
      setShowNewCampaign(false);
      loadAdCampaigns();
    } catch (error) {
      console.error('Error creating ad campaign:', error);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await AdService.deleteAdCampaign(id);
        loadAdCampaigns();
      } catch (error) {
        console.error('Error deleting ad campaign:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Ad Campaigns</h1>
        <button
          onClick={() => setShowNewCampaign(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {showNewCampaign && (
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="e.g., Summer Promotion"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={newCampaign.platform}
                    onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="google">Google Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objective
                  </label>
                  <select
                    value={newCampaign.objective}
                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="awareness">Brand Awareness</option>
                    <option value="traffic">Traffic</option>
                    <option value="conversions">Conversions</option>
                    <option value="leads">Lead Generation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={newCampaign.budget || ''}
                      onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                      className="w-full pl-10 rounded-md border-gray-300"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Type
                  </label>
                  <select
                    value={newCampaign.budget_type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget_type: e.target.value as 'daily' | 'lifetime' })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="daily">Daily Budget</option>
                    <option value="lifetime">Lifetime Budget</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign.start_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newCampaign.end_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audience
                </label>
                <select
                  value={newCampaign.audience_id}
                  onChange={(e) => setNewCampaign({ ...newCampaign, audience_id: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Select an audience...</option>
                  <option value="audience1">Active Customers</option>
                  <option value="audience2">Recent Leads</option>
                  <option value="audience3">Website Visitors</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="btn btn-primary"
                  disabled={!newCampaign.name || !newCampaign.start_date || newCampaign.budget <= 0}
                >
                  Create Campaign
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Active Campaigns</h2>
            {loading ? (
              <div className="text-center py-4">Loading campaigns...</div>
            ) : adCampaigns.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No ad campaigns found
              </div>
            ) : (
              adCampaigns.map(campaign => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                        {campaign.platform === 'facebook' ? 'F' : 
                         campaign.platform === 'instagram' ? 'I' : 'G'}
                      </div>
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {campaign.platform} • {campaign.objective}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View stats"
                      >
                        <BarChart2 size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit campaign"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Delete campaign"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <span className="text-sm text-gray-500">Budget</span>
                      <p className="font-medium">
                        ${campaign.budget} {campaign.budget_type}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Start Date</span>
                      <p className="font-medium">
                        {new Date(campaign.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">End Date</span>
                      <p className="font-medium">
                        {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {campaign.status || 'Active'}
                    </span>
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                    >
                      <span>View on {campaign.platform}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}