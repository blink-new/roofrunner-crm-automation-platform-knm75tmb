import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Users, X } from 'lucide-react';
import { Card } from '../ui/card';
import EmailEditor from './CampaignBuilder/EmailEditor';
import SMSEditor from './CampaignBuilder/SMSEditor';
import RecipientSelector from './CampaignBuilder/RecipientSelector';
import { LaunchpadService } from '../../lib/services/LaunchpadService';

interface LaunchpadInterfaceProps {
  onClose?: () => void;
  standalone?: boolean;
}

export default function LaunchpadInterface({
  onClose,
  standalone = false
}: LaunchpadInterfaceProps) {
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showRecipientSelector, setShowRecipientSelector] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) {
      alert('Please enter content for your message');
      return;
    }

    if (recipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    try {
      setIsSending(true);
      
      if (messageType === 'email') {
        await LaunchpadService.sendEmail({
          to: recipients,
          subject,
          content,
          track_opens: true,
          track_clicks: true
        });
      } else {
        await LaunchpadService.sendSMS({
          to: recipients,
          message: content
        });
      }
      
      alert('Message sent successfully!');
      
      // Reset form
      setSubject('');
      setContent('');
      setRecipients([]);
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Quick Send</h3>
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setMessageType('email')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
              messageType === 'email'
                ? 'bg-primary-50 text-primary-700 border-primary-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Mail size={16} className="inline-block mr-2" />
            Email
          </button>
          <button
            onClick={() => setMessageType('sms')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
              messageType === 'sms'
                ? 'bg-primary-50 text-primary-700 border-primary-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={16} className="inline-block mr-2" />
            SMS
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipients
          </label>
          <div className="flex gap-2">
            <div className="flex-1 border rounded-md p-2 min-h-[40px]">
              {recipients.length === 0 ? (
                <span className="text-gray-400">No recipients selected</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recipients.map(id => (
                    <div
                      key={id}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      <span>{id}</span>
                      <button
                        onClick={() => setRecipients(recipients.filter(r => r !== id))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowRecipientSelector(true)}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Users size={16} />
              <span>Select</span>
            </button>
          </div>
        </div>

        {messageType === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {messageType === 'email' ? 'Email Content' : 'Message Content'}
          </label>
          {messageType === 'email' ? (
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

      <div className="flex justify-end">
        <button
          onClick={handleSend}
          className="btn btn-primary inline-flex items-center gap-2"
          disabled={isSending || !content.trim() || recipients.length === 0}
        >
          <Send size={16} />
          <span>{isSending ? 'Sending...' : 'Send Now'}</span>
        </button>
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>Quick Send</h1>
        <Card className="p-6">
          {renderContent()}
        </Card>
        
        {showRecipientSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Select Recipients</h2>
                <button 
                  onClick={() => setShowRecipientSelector(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <RecipientSelector
                  selectedRecipients={recipients}
                  onChange={setRecipients}
                />
              </div>
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  onClick={() => setShowRecipientSelector(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRecipientSelector(false)}
                  className="btn btn-primary"
                >
                  Confirm Selection
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Quick Send</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </Card>
      
      {showRecipientSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Recipients</h2>
              <button 
                onClick={() => setShowRecipientSelector(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <RecipientSelector
                selectedRecipients={recipients}
                onChange={setRecipients}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowRecipientSelector(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRecipientSelector(false)}
                className="btn btn-primary"
              >
                Confirm Selection
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}