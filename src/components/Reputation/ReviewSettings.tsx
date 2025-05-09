import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import PlatformConnect from './PlatformConnect';
import { AIService } from '../../lib/services/AIService';

export default function ReviewSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('platforms');
  const [autopilotSettings, setAutopilotSettings] = useState<{
    enabled: boolean;
    min_rating?: number;
    max_rating?: number;
    platforms?: string[];
    tone?: 'professional' | 'friendly' | 'apologetic';
  }>({
    enabled: false,
    min_rating: 3,
    tone: 'professional'
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await AIService.getAutopilotSettings();
      setAutopilotSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAutopilot = async () => {
    try {
      setIsSaving(true);
      await AIService.autopilot(autopilotSettings);
    } catch (error) {
      console.error('Error saving autopilot settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation' },
              { label: 'Settings', path: '/reputation/settings', active: true }
            ]}
          />
          <h1 className="mt-2">Review Settings</h1>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('platforms')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'platforms'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Platforms
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'ai'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          AI Settings
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'disputes'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dispute Settings
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'webhooks'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Webhooks
        </button>
      </div>

      {activeTab === 'platforms' && (
        <PlatformConnect />
      )}

      {activeTab === 'ai' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">AI Auto-Pilot Settings</h3>
              <button
                onClick={handleSaveAutopilot}
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autopilotSettings.enabled}
                    onChange={(e) => setAutopilotSettings({
                      ...autopilotSettings,
                      enabled: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable AI Auto-Pilot for reviews
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500 ml-6">
                  Auto-Pilot will automatically respond to reviews based on your settings.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Rating to Auto-Reply
                  </label>
                  <select
                    value={autopilotSettings.min_rating || 3}
                    onChange={(e) => setAutopilotSettings({
                      ...autopilotSettings,
                      min_rating: parseInt(e.target.value)
                    })}
                    className="w-full rounded-md border-gray-300"
                    disabled={!autopilotSettings.enabled}
                  >
                    <option value={1}>1+ Stars</option>
                    <option value={2}>2+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={5}>5 Stars Only</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Only respond to reviews with this rating or higher.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response Tone
                  </label>
                  <select
                    value={autopilotSettings.tone || 'professional'}
                    onChange={(e) => setAutopilotSettings({
                      ...autopilotSettings,
                      tone: e.target.value as any
                    })}
                    className="w-full rounded-md border-gray-300"
                    disabled={!autopilotSettings.enabled}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="apologetic">Apologetic</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    The tone of voice used in automated responses.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platforms
                </label>
                <div className="space-y-1">
                  {['google', 'facebook', 'yelp'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!autopilotSettings.platforms || autopilotSettings.platforms.includes(platform)}
                        onChange={(e) => {
                          const platforms = autopilotSettings.platforms || ['google', 'facebook', 'yelp'];
                          if (e.target.checked) {
                            setAutopilotSettings({
                              ...autopilotSettings,
                              platforms: [...platforms, platform]
                            });
                          } else {
                            setAutopilotSettings({
                              ...autopilotSettings,
                              platforms: platforms.filter(p => p !== platform)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600"
                        disabled={!autopilotSettings.enabled}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Response Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {autopilotSettings.tone === 'professional' ? (
                      "Thank you for your feedback. We appreciate you taking the time to share your experience with us. We're glad to hear that you enjoyed our service and we look forward to serving you again in the future."
                    ) : autopilotSettings.tone === 'friendly' ? (
                      "Thanks so much for the awesome review! We're thrilled that you had a great experience with us. Your feedback means a lot to our team, and we can't wait to see you again soon!"
                    ) : (
                      "Thank you for bringing this to our attention. We sincerely apologize for the experience you had. We take all feedback seriously and would like to make things right. Please contact us directly so we can address your concerns."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'disputes' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Dispute Settings</h3>
              <button
                onClick={() => navigate('/reputation/disputes')}
                className="btn btn-primary"
              >
                View Disputes
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Dispute Reason
                </label>
                <select
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="fake_review">Fake or Spam Review</option>
                  <option value="offensive_content">Offensive Content</option>
                  <option value="not_customer">Not a Customer</option>
                  <option value="conflict_of_interest">Conflict of Interest</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-Flag Reviews
                </label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Flag reviews with offensive language
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Flag reviews from non-customers
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Flag reviews with competitor mentions
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispute Templates
                </label>
                <textarea
                  className="w-full rounded-md border-gray-300"
                  rows={4}
                  placeholder="This review violates platform guidelines because..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Create a template for dispute submissions to save time.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'webhooks' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Webhooks</h3>
              <button
                className="btn btn-primary"
              >
                Add Webhook
              </button>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">New Review Notification</h4>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Receive a webhook notification whenever a new review is received.
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-xs">https://example.com/webhooks/reviews</code>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Review Response Notification</h4>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Receive a webhook notification whenever a review response is posted.
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-xs">https://example.com/webhooks/responses</code>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Webhook Format</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-xs overflow-x-auto">
{`{
  "event": "review.created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "google",
    "rating": 5,
    "content": "Great service!",
    "author_name": "John Doe",
    "created_at": "2025-01-01T12:00:00Z"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}