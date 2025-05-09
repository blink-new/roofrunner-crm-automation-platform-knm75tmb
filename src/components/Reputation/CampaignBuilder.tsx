import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Plus, Mail, MessageSquare, 
  Calendar, Users, Settings, BarChart2, Send
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import TemplateManager from './TemplateManager';
import BalanceSettings from './BalanceSettings';
import GatingFlow from './GatingFlow';
import QRCodeManager from './QRCodeManager';
import RecipientSelector from '../Marketing/CampaignBuilder/RecipientSelector';
import { ReputationService } from '../../lib/services/ReputationService';

export default function CampaignBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [activeTab, setActiveTab] = useState('content');
  const [campaignType, setCampaignType] = useState('email');
  const [campaignName, setCampaignName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<{
    type: 'immediate' | 'delay';
    delay_days?: number;
    follow_up?: {
      enabled: boolean;
      delay_days: number;
      template_id: string;
    };
  }>({ type: 'immediate' });
  const [gatingEnabled, setGatingEnabled] = useState(false);
  const [gatingThreshold, setGatingThreshold] = useState(3);
  const [platformBalance, setPlatformBalance] = useState<Record<string, number>>({
    google: 50,
    facebook: 25,
    yelp: 25
  });
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    loadTemplates();
    if (isEditing) {
      loadCampaign();
    }
  }, [id]);

  const loadTemplates = async () => {
    try {
      const data = await ReputationService.getReviewTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadCampaign = async () => {
    try {
      const campaign = await ReputationService.getReviewCampaign(id!);
      setCampaignName(campaign.name);
      setCampaignType(campaign.type);
      setTemplateId(campaign.template_id);
      setSchedule(campaign.schedule);
      setGatingEnabled(campaign.gating_enabled || false);
      setGatingThreshold(campaign.gating_threshold || 3);
      setPlatformBalance(campaign.platform_balance || {
        google: 50,
        facebook: 25,
        yelp: 25
      });
      
      // Load template details
      if (campaign.template_id) {
        const template = await ReputationService.getReviewTemplate(campaign.template_id);
        setSelectedTemplate(template);
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const campaignData = {
        name: campaignName,
        type: campaignType,
        template_id: templateId,
        audience: {
          type: 'segment',
          id: 'all'
        },
        schedule,
        gating_enabled: gatingEnabled,
        gating_threshold: gatingThreshold,
        platform_balance: platformBalance
      };
      
      if (isEditing) {
        await ReputationService.updateReviewCampaign(id!, campaignData);
      } else {
        const newCampaign = await ReputationService.createReviewCampaign(campaignData);
        navigate(`/reputation/campaigns/${newCampaign.id}`);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateSelect = async (id: string) => {
    setTemplateId(id);
    try {
      const template = await ReputationService.getReviewTemplate(id);
      setSelectedTemplate(template);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation' },
              { label: 'Campaigns', path: '/reputation/campaigns' },
              { 
                label: isEditing ? 'Edit Campaign' : 'New Campaign', 
                path: isEditing ? `/reputation/campaigns/${id}` : '/reputation/campaigns/new', 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/reputation/campaigns')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Campaign' : 'New Campaign'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="btn btn-secondary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <div className="relative group">
            <button
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Send Now
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Schedule
              </button>
            </div>
          </div>
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
                  onClick={() => setActiveTab('schedule')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'schedule'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('gating')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'gating'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Review Gating
                </button>
                <button
                  onClick={() => setActiveTab('balance')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'balance'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Platform Balance
                </button>
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'qr'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  QR Codes
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
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full rounded-md border-gray-300"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={campaignType === 'email'}
                          onChange={() => setCampaignType('email')}
                          className="rounded-full border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          <Mail size={16} className="inline-block mr-1" />
                          Email
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={campaignType === 'sms'}
                          onChange={() => setCampaignType('sms')}
                          className="rounded-full border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          <MessageSquare size={16} className="inline-block mr-1" />
                          SMS
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <select
                          value={templateId}
                          onChange={(e) => handleTemplateSelect(e.target.value)}
                          className="flex-1 rounded-md border-gray-300"
                        >
                          <option value="">Select a template</option>
                          {templates
                            .filter(t => t.type === campaignType)
                            .map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))
                          }
                        </select>
                        <button
                          onClick={() => navigate('/reputation/templates')}
                          className="btn btn-secondary"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {selectedTemplate && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-medium mb-2">{selectedTemplate.name}</h3>
                          {campaignType === 'email' && selectedTemplate.subject && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Subject: </span>
                              <span className="text-sm">{selectedTemplate.subject}</span>
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-wrap">
                            {selectedTemplate.content}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipients' && (
                <RecipientSelector
                  selectedRecipients={recipients}
                  onChange={setRecipients}
                />
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Schedule Campaign</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={schedule.type === 'immediate'}
                            onChange={() => setSchedule({ type: 'immediate' })}
                            className="rounded-full border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Send immediately after job completion
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={schedule.type === 'delay'}
                            onChange={() => setSchedule({ 
                              type: 'delay', 
                              delay_days: schedule.delay_days || 2 
                            })}
                            className="rounded-full border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Send with delay after job completion
                          </span>
                        </label>
                        {schedule.type === 'delay' && (
                          <div className="mt-2 ml-6">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">Wait</span>
                              <input
                                type="number"
                                value={schedule.delay_days || 2}
                                onChange={(e) => setSchedule({
                                  ...schedule,
                                  delay_days: parseInt(e.target.value)
                                })}
                                className="w-16 rounded-md border-gray-300"
                                min="1"
                              />
                              <span className="text-sm text-gray-700">days after job completion</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-medium mb-2">Follow-up Settings</h4>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={schedule.follow_up?.enabled || false}
                              onChange={(e) => setSchedule({
                                ...schedule,
                                follow_up: {
                                  enabled: e.target.checked,
                                  delay_days: schedule.follow_up?.delay_days || 5,
                                  template_id: schedule.follow_up?.template_id || ''
                                }
                              })}
                              className="rounded border-gray-300 text-primary-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Send follow-up if no review is submitted
                            </span>
                          </label>

                          {schedule.follow_up?.enabled && (
                            <div className="ml-6 space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">Wait</span>
                                <input
                                  type="number"
                                  value={schedule.follow_up.delay_days || 5}
                                  onChange={(e) => setSchedule({
                                    ...schedule,
                                    follow_up: {
                                      ...schedule.follow_up,
                                      delay_days: parseInt(e.target.value)
                                    }
                                  })}
                                  className="w-16 rounded-md border-gray-300"
                                  min="1"
                                />
                                <span className="text-sm text-gray-700">days after initial invitation</span>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Follow-up Template
                                </label>
                                <select
                                  value={schedule.follow_up.template_id || ''}
                                  onChange={(e) => setSchedule({
                                    ...schedule,
                                    follow_up: {
                                      ...schedule.follow_up,
                                      template_id: e.target.value
                                    }
                                  })}
                                  className="w-full rounded-md border-gray-300"
                                >
                                  <option value="">Select a template</option>
                                  {templates
                                    .filter(t => t.type === campaignType)
                                    .map(template => (
                                      <option key={template.id} value={template.id}>
                                        {template.name}
                                      </option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gating' && (
                <GatingFlow
                  enabled={gatingEnabled}
                  threshold={gatingThreshold}
                  onEnableChange={setGatingEnabled}
                  onThresholdChange={setGatingThreshold}
                />
              )}

              {activeTab === 'balance' && (
                <BalanceSettings
                  balance={platformBalance}
                  onChange={setPlatformBalance}
                />
              )}

              {activeTab === 'qr' && (
                <QRCodeManager />
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
                <span className="font-medium capitalize">{campaignType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Template:</span>
                <span className="font-medium">{selectedTemplate?.name || 'None selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recipients:</span>
                <span className="font-medium">{recipients.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium">Draft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gating:</span>
                <span className="font-medium">{gatingEnabled ? `Enabled (${gatingThreshold}+)` : 'Disabled'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('content')}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <Mail size={16} className="inline-block mr-2 text-primary-500" />
                Edit Template
              </button>
              <button
                onClick={() => setActiveTab('recipients')}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <Users size={16} className="inline-block mr-2 text-primary-500" />
                Select Recipients
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <Calendar size={16} className="inline-block mr-2 text-primary-500" />
                Set Schedule
              </button>
              <button
                onClick={() => setActiveTab('balance')}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                <Settings size={16} className="inline-block mr-2 text-primary-500" />
                Platform Balance
              </button>
              {isEditing && (
                <button
                  onClick={() => {/* Navigate to campaign stats */}}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                >
                  <BarChart2 size={16} className="inline-block mr-2 text-primary-500" />
                  View Analytics
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}