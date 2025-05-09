import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Plus, Trash2, Play, Check, X } from 'lucide-react';
import { WebhookService } from '../../lib/services/WebhookService';

interface Webhook {
  id: string;
  type: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
}

export default function WebhookSettings() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: ['dashboard.layout.updated']
  });
  const [showForm, setShowForm] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      setLoading(true);
      const data = await WebhookService.getWebhooks('dashboard');
      setWebhooks(data);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    try {
      await WebhookService.createWebhook({
        type: 'dashboard',
        url: newWebhook.url,
        events: newWebhook.events
      });
      setNewWebhook({ url: '', events: ['dashboard.layout.updated'] });
      setShowForm(false);
      loadWebhooks();
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await WebhookService.deleteWebhook(id);
      loadWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await WebhookService.updateWebhook(id, { active: !active });
      loadWebhooks();
    } catch (error) {
      console.error('Error updating webhook:', error);
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      const result = await WebhookService.testWebhook(id);
      setTestResults({
        ...testResults,
        [id]: { success: true, message: 'Webhook test successful' }
      });
      setTimeout(() => {
        setTestResults(prev => {
          const newResults = { ...prev };
          delete newResults[id];
          return newResults;
        });
      }, 3000);
    } catch (error) {
      setTestResults({
        ...testResults,
        [id]: { success: false, message: 'Webhook test failed' }
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Webhook Integrations</h3>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Webhook</span>
          </button>
        </div>

        {showForm && (
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="https://example.com/webhook"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Events
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes('dashboard.layout.updated')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWebhook({
                          ...newWebhook,
                          events: [...newWebhook.events, 'dashboard.layout.updated']
                        });
                      } else {
                        setNewWebhook({
                          ...newWebhook,
                          events: newWebhook.events.filter(e => e !== 'dashboard.layout.updated')
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dashboard Layout Updated</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes('dashboard.widget.updated')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWebhook({
                          ...newWebhook,
                          events: [...newWebhook.events, 'dashboard.widget.updated']
                        });
                      } else {
                        setNewWebhook({
                          ...newWebhook,
                          events: newWebhook.events.filter(e => e !== 'dashboard.widget.updated')
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Widget Updated</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWebhook}
                className="btn btn-primary"
                disabled={!newWebhook.url || newWebhook.events.length === 0}
              >
                Create Webhook
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading webhooks...</div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No webhooks configured
            </div>
          ) : (
            webhooks.map(webhook => (
              <div
                key={webhook.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{webhook.url}</h4>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(webhook.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestWebhook(webhook.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      title="Test webhook"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(webhook.id, webhook.active)}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        webhook.active ? 'text-green-500' : 'text-gray-400'
                      }`}
                      title={webhook.active ? 'Deactivate' : 'Activate'}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Delete webhook"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Events</h5>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map(event => (
                      <span
                        key={event}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {testResults[webhook.id] && (
                  <div className={`p-2 rounded text-sm ${
                    testResults[webhook.id].success
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {testResults[webhook.id].message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}