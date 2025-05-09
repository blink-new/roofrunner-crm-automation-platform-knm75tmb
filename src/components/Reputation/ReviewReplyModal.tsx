import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card } from '../ui/card';
import { AIService } from '../../lib/services/AIService';

interface ReviewReplyModalProps {
  review: {
    id: string;
    author_name: string;
    rating: number;
    content: string;
    platform: string;
    created_at: string;
    response?: string;
  };
  onClose: () => void;
  onSave: (reply: string) => void;
}

export default function ReviewReplyModal({
  review,
  onClose,
  onSave
}: ReviewReplyModalProps) {
  const [reply, setReply] = useState(review.response || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAutopilot, setShowAutopilot] = useState(false);
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

  useEffect(() => {
    // Load autopilot settings
    const loadAutopilotSettings = async () => {
      try {
        const settings = await AIService.getAutopilotSettings();
        setAutopilotSettings(settings);
      } catch (error) {
        console.error('Error loading autopilot settings:', error);
      }
    };
    
    loadAutopilotSettings();
  }, []);

  const handleSuggestReply = async () => {
    try {
      setIsGenerating(true);
      const suggested = await AIService.suggestReply(review.id);
      setReply(suggested);
    } catch (error) {
      console.error('Error generating reply suggestion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAutopilot = async () => {
    try {
      await AIService.autopilot(autopilotSettings);
      setShowAutopilot(false);
    } catch (error) {
      console.error('Error saving autopilot settings:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Reply to Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{review.author_name}</span>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 capitalize">{review.platform}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700">{review.content}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Your Response
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSuggestReply}
                    className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                    disabled={isGenerating}
                  >
                    <Zap size={14} />
                    <span>{isGenerating ? 'Generating...' : 'Suggest Reply'}</span>
                  </button>
                  <button
                    onClick={() => setShowAutopilot(!showAutopilot)}
                    className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                  >
                    {autopilotSettings.enabled ? (
                      <ToggleRight size={14} />
                    ) : (
                      <ToggleLeft size={14} />
                    )}
                    <span>Auto-Pilot</span>
                  </button>
                </div>
              </div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full rounded-md border-gray-300"
                rows={6}
                placeholder="Type your response here..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Respond professionally and thank the customer for their feedback. Address any concerns they mentioned.
              </p>
            </div>

            {showAutopilot && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Auto-Pilot Settings</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Auto-Pilot automatically responds to reviews based on your settings.
                </p>
                
                <div className="space-y-4">
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
                      Enable Auto-Pilot for reviews
                    </span>
                  </label>
                  
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
                    >
                      <option value={1}>1+ Stars</option>
                      <option value={2}>2+ Stars</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={5}>5 Stars Only</option>
                    </select>
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
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="apologetic">Apologetic</option>
                    </select>
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
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAutopilot(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAutopilot}
                      className="btn btn-primary"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(reply)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={!reply.trim()}
          >
            <MessageSquare size={16} />
            <span>Post Reply</span>
          </button>
        </div>
      </Card>
    </div>
  );
}