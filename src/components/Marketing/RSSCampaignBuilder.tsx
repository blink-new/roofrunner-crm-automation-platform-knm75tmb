import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Clock, Rss, 
  RefreshCw, Settings, Calendar 
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import RecipientSelector from './CampaignBuilder/RecipientSelector';
import EmailEditor from './CampaignBuilder/EmailEditor';
import { CampaignService } from '../../lib/services/CampaignService';

export default function RSSCampaignBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [name, setName] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [sendTime, setSendTime] = useState('09:00');
  const [maxItems, setMaxItems] = useState(5);
  const [template, setTemplate] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const campaignData = {
        name,
        type: 'rss',
        content: template,
        schedule: {
          type: 'recurring',
          frequency,
          sendTime,
        },
        rss_settings: {
          feed_url: feedUrl,
          max_items: maxItems
        },
        status: 'active'
      };
      
      if (isEditing) {
        await CampaignService.updateCampaign(id!, campaignData);
      } else {
        const newCampaign = await CampaignService.createCampaign(campaignData);
        navigate(`/marketing/${newCampaign.id}`);
      }
    } catch (error) {
      console.error('Error saving RSS campaign:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchFeed = async () => {
    if (!feedUrl) {
      alert('Please enter a feed URL');
      return;
    }
    
    try {
      // In a real app, this would fetch the feed and show a preview
      alert('Feed fetched successfully!');
    } catch (error) {
      console.error('Error fetching feed:', error);
      alert('Failed to fetch feed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Marketing', path: '/marketing' },
              { 
                label: isEditing ? 'Edit RSS Campaign' : 'New RSS Campaign', 
                path: isEditing ? `/marketing/rss/${id}` : '/marketing/rss/new', 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/marketing')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit RSS Campaign' : 'New RSS Campaign'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Campaign'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <Card className="overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'content'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('recipients')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'recipients'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recipients
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border-gray-300"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RSS Feed URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={feedUrl}
                        onChange={(e) => setFeedUrl(e.target.value)}
                        className="flex-1 rounded-md border-gray-300"
                        placeholder="https://example.com/feed.xml"
                      />
                      <button
                        onClick={handleFetchFeed}
                        className="btn btn-secondary inline-flex items-center gap-2"
                      >
                        <RefreshCw size={16} />
                        <span>Fetch</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Template
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                      Use <code>{'{{items}}'}</code> to insert feed items. Each item has <code>title</code>, <code>link</code>, <code>description</code>, and <code>pubDate</code>.
                    </p>
                    <EmailEditor
                      value={template}
                      onChange={setTemplate}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'recipients' && (
                <RecipientSelector
                  selectedRecipients={recipients}
                  onChange={setRecipients}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">RSS Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency
                        </label>
                        <select
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="w-full rounded-md border-gray-300"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Send Time
                        </label>
                        <input
                          type="time"
                          value={sendTime}
                          onChange={(e) => setSendTime(e.target.value)}
                          className="w-full rounded-md border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Items
                        </label>
                        <input
                          type="number"
                          value={maxItems}
                          onChange={(e) => setMaxItems(parseInt(e.target.value))}
                          className="w-full rounded-md border-gray-300"
                          min="1"
                          max="20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum number of items to include in each email
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Only send when new content is available
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Campaign Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">RSS Campaign</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recipients:</span>
                <span className="font-medium">{recipients.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frequency:</span>
                <span className="font-medium capitalize">{frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium">Draft</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleFetchFeed}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <RefreshCw size={16} className="inline-block mr-2" />
                Fetch Latest Content
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <Rss size={16} className="inline-block mr-2" />
                Preview Feed
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <Calendar size={16} className="inline-block mr-2" />
                View Schedule
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}