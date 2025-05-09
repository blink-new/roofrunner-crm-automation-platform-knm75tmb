import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Play, Clock, Send, ChevronLeft, 
  Users, Settings, Code, Copy, Trash2 
} from 'lucide-react';
import { Card } from '../../ui/card';
import Breadcrumbs from '../../Navigation/Breadcrumbs';
import EmailEditor from './EmailEditor';
import SMSEditor from './SMSEditor';
import RecipientSelector from './RecipientSelector';
import ScheduleSettings from './ScheduleSettings';
import ABTestManager from '../ABTestManager';
import TriggerLinkManager from '../TriggerLinkManager';
import ComplianceBanner from '../ComplianceBanner';
import { CampaignService } from '../../../lib/services/CampaignService';
import { EmailService } from '../../../lib/services/EmailService';
import { SMSService } from '../../../lib/services/SMSService';
import { ComplianceService } from '../../../lib/services/ComplianceService';

export default function CampaignBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [activeTab, setActiveTab] = useState('content');
  const [campaignType, setCampaignType] = useState('email');
  const [campaignName, setCampaignName] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<{
    type: 'now' | 'later' | 'recurring';
    sendAt?: string;
    recurrence?: string;
  }>({ type: 'now' });
  const [isSaving, setIsSaving] = useState(false);
  const [showABTest, setShowABTest] = useState(false);
  const [showTriggerLinks, setShowTriggerLinks] = useState(false);
  const [complianceIssues, setComplianceIssues] = useState<{
    type: 'error' | 'warning';
    message: string;
  }[]>([]);

  useEffect(() => {
    if (isEditing) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    try {
      const campaign = await CampaignService.getCampaign(id!);
      setCampaignType(campaign.type);
      setCampaignName(campaign.name);
      setContent(campaign.content);
      setSubject(campaign.subject || '');
      // Load other campaign data
    } catch (error) {
      console.error('Error loading campaign:', error);
    }
  };

  const validateCampaign = async () => {
    try {
      if (campaignType === 'email') {
        const result = await ComplianceService.validateEmailTemplate(content);
        setComplianceIssues(result.issues);
        return result.valid;
      } else if (campaignType === 'sms') {
        const result = await ComplianceService.validateSMSTemplate(content);
        setComplianceIssues(result.issues);
        return result.valid;
      }
      return true;
    } catch (error) {
      console.error('Error validating campaign:', error);
      return false;
    }
  };

  const handleSave = async () => {
    const isValid = await validateCampaign();
    if (!isValid && !window.confirm('There are compliance issues with this campaign. Save anyway?')) {
      return;
    }

    try {
      setIsSaving(true);
      
      const campaignData = {
        name: campaignName,
        type: campaignType,
        subject: subject,
        content: content,
        schedule: schedule,
        status: 'draft'
      };
      
      if (isEditing) {
        await CampaignService.updateCampaign(id!, campaignData);
      } else {
        const newCampaign = await CampaignService.createCampaign(campaignData);
        navigate(`/marketing/${newCampaign.id}`);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    try {
      if (campaignType === 'email') {
        await EmailService.sendTestEmail(
          'test@example.com',
          subject,
          content
        );
      } else if (campaignType === 'sms') {
        await SMSService.sendTestSMS(
          '+15551234567',
          content
        );
      }
      alert('Test sent successfully!');
    } catch (error) {
      console.error('Error sending test:', error);
      alert('Failed to send test');
    }
  };

  const handleSendCampaign = async () => {
    const isValid = await validateCampaign();
    if (!isValid && !window.confirm('There are compliance issues with this campaign. Send anyway?')) {
      return;
    }

    try {
      if (!isEditing) {
        // Save first if this is a new campaign
        const campaignData = {
          name: campaignName,
          type: campaignType,
          subject: subject,
          content: content,
          schedule: { type: 'now' },
          status: 'active'
        };
        
        const newCampaign = await CampaignService.createCampaign(campaignData);
        await CampaignService.sendCampaign(newCampaign.id);
        navigate('/marketing');
      } else {
        await CampaignService.sendCampaign(id!);
        navigate('/marketing');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
    }
  };

  const handleScheduleCampaign = async () => {
    if (!schedule.sendAt) {
      alert('Please select a send date and time');
      return;
    }

    const isValid = await validateCampaign();
    if (!isValid && !window.confirm('There are compliance issues with this campaign. Schedule anyway?')) {
      return;
    }

    try {
      if (!isEditing) {
        // Save first if this is a new campaign
        const campaignData = {
          name: campaignName,
          type: campaignType,
          subject: subject,
          content: content,
          schedule: schedule,
          status: 'scheduled'
        };
        
        const newCampaign = await CampaignService.createCampaign(campaignData);
        await CampaignService.scheduleCampaign(newCampaign.id, schedule.sendAt);
        navigate('/marketing');
      } else {
        await CampaignService.scheduleCampaign(id!, schedule.sendAt);
        navigate('/marketing');
      }
    } catch (error) {
      console.error('Error scheduling campaign:', error);
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
                label: isEditing ? 'Edit Campaign' : 'New Campaign', 
                path: isEditing ? `/marketing/${id}` : '/marketing/new', 
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
            <h1>{isEditing ? 'Edit Campaign' : 'New Campaign'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSendTest}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Play size={16} />
            <span>Send Test</span>
          </button>

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
                onClick={handleSendCampaign}
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

      {complianceIssues.length > 0 && (
        <ComplianceBanner issues={complianceIssues} />
      )}

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
                    <select
                      value={campaignType}
                      onChange={(e) => setCampaignType(e.target.value)}
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="email">Email Campaign</option>
                      <option value="sms">SMS Campaign</option>
                      <option value="drip">Drip Sequence</option>
                      <option value="rss">RSS Campaign</option>
                    </select>
                  </div>

                  {campaignType === 'email' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-md border-gray-300"
                        placeholder="Enter subject line"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {campaignType === 'email' ? 'Email Content' : 'Message Content'}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowTriggerLinks(true)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Add Trigger Link
                        </button>
                        {campaignType === 'email' && (
                          <button
                            onClick={() => setShowABTest(true)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            A/B Test
                          </button>
                        )}
                      </div>
                    </div>

                    {campaignType === 'email' ? (
                      <EmailEditor
                        value={content}
                        onChange={setContent}
                      />
                    ) : (
                      <SMSEditor
                        value={content}
                        onChange={setContent}
                      />
                    )}
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
                <ScheduleSettings
                  schedule={schedule}
                  onChange={setSchedule}
                  onSchedule={handleScheduleCampaign}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Campaign Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Track opens
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Track clicks
                          </span>
                        </label>
                      </div>
                      {campaignType === 'email' && (
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Include unsubscribe link
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                    <div className="space-y-4">
                      {campaignType === 'email' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              From Name
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border-gray-300"
                              placeholder="Your Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Reply-To Email
                            </label>
                            <input
                              type="email"
                              className="w-full rounded-md border-gray-300"
                              placeholder="reply@example.com"
                            />
                          </div>
                        </>
                      )}
                      {campaignType === 'sms' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Number
                          </label>
                          <select className="w-full rounded-md border-gray-300">
                            <option>+1 (555) 123-4567</option>
                          </select>
                        </div>
                      )}
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
                <span className="font-medium capitalize">{campaignType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recipients:</span>
                <span className="font-medium">{recipients.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium">Draft</span>
              </div>
              {schedule.type !== 'now' && schedule.sendAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="font-medium">
                    {new Date(schedule.sendAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleSendTest}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                Send Test
              </button>
              <button
                onClick={() => setShowABTest(true)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                Create A/B Test
              </button>
              <button
                onClick={() => {
                  // Duplicate functionality
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                Duplicate Campaign
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md text-red-600"
              >
                Delete Campaign
              </button>
            </div>
          </Card>
        </div>
      </div>

      {showABTest && (
        <ABTestManager
          campaignId={id || ''}
          onClose={() => setShowABTest(false)}
          onSave={() => {
            setShowABTest(false);
            // Handle save
          }}
        />
      )}

      {showTriggerLinks && (
        <TriggerLinkManager
          onClose={() => setShowTriggerLinks(false)}
          onInsert={(linkCode) => {
            setContent(content + linkCode);
            setShowTriggerLinks(false);
          }}
        />
      )}
    </div>
  );
}