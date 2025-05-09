import React, { useState } from 'react';
import { 
  Phone, Mail, MoreVertical, Paperclip, Zap, Send, Plus,
  Folder, Star, Trash, ChevronRight, DollarSign, Smile
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Thread } from '../../types/conversations';
import MessageBubble from './MessageBubble';
import SidePanel from './SidePanel';

interface MessageDetailProps {
  thread: Thread | null;
  showProfile: boolean;
  onToggleProfile: () => void;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ 
  thread,
  showProfile,
  onToggleProfile
}) => {
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('sms');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [fromNumber, setFromNumber] = useState('+1 847-582-4754');
  const [toNumber, setToNumber] = useState('+1 608-931-5106');

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Select a conversation
        </h2>
        <p className="text-gray-500 text-center">
          Choose a conversation from the list or start a new one
        </p>
      </div>
    );
  }

  const channels = [
    { id: 'sms', label: 'SMS' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'email', label: 'Email' }
  ];

  const snippetCategories = [
    {
      title: 'Manual Actions',
      items: ['Schedule Follow-up', 'Create Task', 'Add Note']
    },
    {
      title: 'Snippets',
      items: ['Greeting', 'Thank You', 'Follow-up', 'Closing']
    },
    {
      title: 'Trigger Links',
      items: ['Payment Request', 'Feedback Form', 'Schedule Meeting']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{thread.contact.name}</h2>
            <div className="flex items-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Folder size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Star size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Mail size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Trash size={20} />
            </button>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={onToggleProfile}
            >
              <ChevronRight 
                size={20} 
                className={`transform transition-transform ${showProfile ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isOutgoing={message.sender === 'user'}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2 mb-3">
          {channels.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeChannel === channel.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {channel.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-gray-600 mb-1">From:</label>
            <select 
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md"
            >
              <option value={fromNumber}>{fromNumber}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600 mb-1">To:</label>
            <select
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md"
            >
              <option value={toNumber}>{toNumber}</option>
            </select>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-50 rounded-lg">
            <TextareaAutosize
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none"
              minRows={1}
              maxRows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Paperclip size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Smile size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <DollarSign size={20} />
          </button>
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => setSidePanelOpen(true)}
          >
            <Zap size={20} />
          </button>
          <button 
            className={`p-2 rounded-full ${
              message.trim()
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <SidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        title="Snippets"
      >
        <div className="space-y-6">
          {snippetCategories.map((category, index) => (
            <div key={index}>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {category.title}
              </h4>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => {
                      setMessage(prev => prev + ' ' + item);
                      setSidePanelOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SidePanel>
    </div>
  );
};

export default MessageDetail;