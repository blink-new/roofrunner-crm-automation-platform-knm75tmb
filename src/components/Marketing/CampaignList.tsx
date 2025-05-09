import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Mail, MessageSquare, Clock, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Campaign } from '../../types/marketing';

export default function CampaignList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Spring Promotion',
      type: 'email',
      status: 'active',
      stats: {
        sent: 1234,
        opened: 856,
        clicked: 234,
        converted: 45
      },
      schedule: {
        type: 'one-time',
        sendAt: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Marketing', path: '/marketing', active: true }
            ]}
          />
          <h1 className="mt-2">Marketing Campaigns</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/marketing/lists')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Lists</span>
          </button>

          <button
            onClick={() => navigate('/marketing/templates')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Mail size={16} />
            <span>Templates</span>
          </button>

          <button
            onClick={() => navigate('/marketing/new')}
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
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/marketing/${campaign.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {campaign.type === 'email' ? (
                        <Mail size={20} className="text-primary-500" />
                      ) : (
                        <MessageSquare size={20} className="text-primary-500" />
                      )}
                      <h3 className="font-medium">{campaign.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Sent</div>
                      <div className="text-lg font-medium">{campaign.stats.sent}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Opened</div>
                      <div className="text-lg font-medium">{campaign.stats.opened}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Clicked</div>
                      <div className="text-lg font-medium">{campaign.stats.clicked}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Converted</div>
                      <div className="text-lg font-medium">{campaign.stats.converted}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>
                      {campaign.schedule.type === 'one-time'
                        ? 'Scheduled for ' + new Date(campaign.schedule.sendAt).toLocaleDateString()
                        : 'Recurring campaign'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}