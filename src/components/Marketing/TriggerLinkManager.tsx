import React, { useState, useEffect } from 'react';
import { X, Plus, Copy, Link, Trash2, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { TriggerLinkService } from '../../lib/services/TriggerLinkService';

interface TriggerLinkManagerProps {
  onClose: () => void;
  onInsert?: (linkCode: string) => void;
}

export default function TriggerLinkManager({
  onClose,
  onInsert
}: TriggerLinkManagerProps) {
  const [triggerLinks, setTriggerLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLink, setShowNewLink] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    action: '',
    parameters: {}
  });

  useEffect(() => {
    loadTriggerLinks();
  }, []);

  const loadTriggerLinks = async () => {
    try {
      setLoading(true);
      const data = await TriggerLinkService.getTriggerLinks();
      setTriggerLinks(data);
    } catch (error) {
      console.error('Error loading trigger links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    try {
      await TriggerLinkService.createTriggerLink(newLink);
      setNewLink({ name: '', action: '', parameters: {} });
      setShowNewLink(false);
      loadTriggerLinks();
    } catch (error) {
      console.error('Error creating trigger link:', error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trigger link?')) {
      try {
        await TriggerLinkService.deleteTriggerLink(id);
        loadTriggerLinks();
      } catch (error) {
        console.error('Error deleting trigger link:', error);
      }
    }
  };

  const handleCopyLink = (id: string) => {
    const shortcode = TriggerLinkService.generateShortcode(id);
    navigator.clipboard.writeText(shortcode);
  };

  const handleInsertLink = (id: string) => {
    if (onInsert) {
      const shortcode = TriggerLinkService.generateShortcode(id);
      onInsert(shortcode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Trigger Links</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Trigger links allow you to track specific actions when recipients click on them.
              </p>
              <button
                onClick={() => setShowNewLink(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} />
                <span>New Trigger Link</span>
              </button>
            </div>

            {showNewLink && (
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Name
                  </label>
                  <input
                    type="text"
                    value={newLink.name}
                    onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                    placeholder="e.g., Download Brochure"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action
                  </label>
                  <select
                    value={newLink.action}
                    onChange={(e) => setNewLink({ ...newLink, action: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="">Select an action...</option>
                    <option value="redirect">Redirect to URL</option>
                    <option value="download">Download File</option>
                    <option value="form">Show Form</option>
                    <option value="payment">Payment Request</option>
                    <option value="booking">Schedule Meeting</option>
                    <option value="custom">Custom Action</option>
                  </select>
                </div>

                {newLink.action === 'redirect' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination URL
                    </label>
                    <input
                      type="url"
                      value={newLink.parameters.url || ''}
                      onChange={(e) => setNewLink({
                        ...newLink,
                        parameters: { ...newLink.parameters, url: e.target.value }
                      })}
                      className="w-full rounded-md border-gray-300"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNewLink(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLink}
                    className="btn btn-primary"
                    disabled={!newLink.name || !newLink.action}
                  >
                    Create Link
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading trigger links...</div>
              ) : triggerLinks.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No trigger links found. Create your first trigger link to get started.
                </div>
              ) : (
                triggerLinks.map(link => (
                  <div key={link.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link size={16} className="text-primary-500" />
                        <h3 className="font-medium">{link.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyLink(link.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy shortcode"
                        >
                          <Copy size={14} />
                        </button>
                        {onInsert && (
                          <button
                            onClick={() => handleInsertLink(link.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Insert into content"
                          >
                            <ExternalLink size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Delete link"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 capitalize">
                      Action: {link.action}
                    </p>
                    <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                      {TriggerLinkService.generateShortcode(link.id)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}