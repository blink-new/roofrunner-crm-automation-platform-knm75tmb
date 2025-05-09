import React, { useState } from 'react';
import { Bot, ChevronDown } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  description: string;
}

interface BotSelectorProps {
  onSelect: (botId: string) => void;
}

export default function BotSelector({ onSelect }: BotSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bots] = useState<Bot[]>([
    { id: 'sales', name: 'Sales Bot', description: 'Handles sales inquiries and qualification' },
    { id: 'support', name: 'Support Bot', description: 'Provides customer support and troubleshooting' },
    { id: 'booking', name: 'Booking Bot', description: 'Manages appointment scheduling' }
  ]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
      >
        <Bot size={16} />
        <span className="text-sm">AI Assistant</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          {bots.map(bot => (
            <button
              key={bot.id}
              onClick={() => {
                onSelect(bot.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <div className="font-medium text-sm">{bot.name}</div>
              <div className="text-xs text-gray-500">{bot.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}