import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Settings, User, Clock } from 'lucide-react';
import MessageComposer from './MessageComposer';
import MessageBubble from './MessageBubble';

interface LiveChatThreadProps {
  widgetId: string;
}

export default function LiveChatThread({ widgetId }: LiveChatThreadProps) {
  const [visitor] = useState({
    id: '123',
    name: 'Website Visitor',
    location: 'United States',
    currentPage: '/pricing',
    timeOnSite: '5:23',
    browser: 'Chrome',
    device: 'Desktop'
  });

  const [messages] = useState([
    {
      id: '1',
      content: 'Hi, I have a question about your services',
      sender: 'visitor',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      content: 'Of course! I\'d be happy to help. What would you like to know?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 240000)
    }
  ]);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-9 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                {visitor.name[0]}
              </div>
              <div>
                <h2 className="font-medium">{visitor.name}</h2>
                <p className="text-sm text-gray-500">{visitor.location}</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={{
                  ...message,
                  content: message.content,
                  timestamp: message.timestamp
                }}
                isOutgoing={message.sender === 'agent'}
              />
            ))}
          </div>

          <MessageComposer
            onSend={async (content) => {
              // Handle message send
              console.log('Sending message:', content);
            }}
          />
        </Card>
      </div>

      <div className="col-span-3">
        <Card className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Visitor Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-600">{visitor.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-600">Time on site: {visitor.timeOnSite}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Page</h3>
            <p className="text-sm text-gray-600">{visitor.currentPage}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">System Info</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Browser: {visitor.browser}</p>
              <p className="text-sm text-gray-600">Device: {visitor.device}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}