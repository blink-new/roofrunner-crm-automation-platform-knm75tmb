import React from 'react';
import { MessageSquare, Phone, Mail } from 'lucide-react';

export default function ConversationsWidget() {
  const channels = [
    {
      icon: MessageSquare,
      label: 'SMS',
      unread: 5,
      total: 12
    },
    {
      icon: Phone,
      label: 'Calls',
      unread: 2,
      total: 8
    },
    {
      icon: Mail,
      label: 'Email',
      unread: 3,
      total: 15
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {channels.map((channel, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg"
          >
            <div className="p-2 bg-white rounded-full mb-2">
              <channel.icon size={20} className="text-gray-600" />
            </div>
            <div className="text-sm font-medium">{channel.label}</div>
            <div className="text-xs text-gray-500 mt-1">
              {channel.unread} unread
            </div>
          </div>
        ))}
      </div>

      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full"
          style={{ width: '65%' }}
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        Response rate: 65%
      </div>
    </div>
  );
}