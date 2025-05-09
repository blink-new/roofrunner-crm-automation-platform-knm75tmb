import React from 'react';
import { MessageSquare, Mail, MessageCircle, Phone } from 'lucide-react';

interface ChannelFilterProps {
  selectedChannels: string[];
  onChannelChange: (channels: string[]) => void;
}

export default function ChannelFilter({ selectedChannels, onChannelChange }: ChannelFilterProps) {
  const channels = [
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'messenger', label: 'Messenger', icon: MessageCircle },
    { id: 'phone', label: 'Phone', icon: Phone }
  ];

  const toggleChannel = (channelId: string) => {
    if (selectedChannels.includes(channelId)) {
      onChannelChange(selectedChannels.filter(id => id !== channelId));
    } else {
      onChannelChange([...selectedChannels, channelId]);
    }
  };

  return (
    <div className="flex gap-2 p-4 border-b border-gray-200">
      {channels.map(channel => (
        <button
          key={channel.id}
          onClick={() => toggleChannel(channel.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            selectedChannels.includes(channel.id)
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <channel.icon size={16} />
          <span>{channel.label}</span>
        </button>
      ))}
    </div>
  );
}