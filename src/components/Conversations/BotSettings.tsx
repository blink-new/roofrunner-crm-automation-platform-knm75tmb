import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Bot, Plus, Edit2, Trash2, Play, Pause } from 'lucide-react';

interface ChatBot {
  id: string;
  name: string;
  description: string;
  settings: {
    model: string;
    temperature: number;
    max_tokens: number;
    stop_sequences: string[];
  };
  prompts: {
    greeting: string;
    fallback: string;
  };
  active: boolean;
}

export default function BotSettings() {
  const [bots, setBots] = useState<ChatBot[]>([
    {
      id: '1',
      name: 'Sales Assistant',
      description: 'Handles product inquiries and pricing questions',
      settings: {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 150,
        stop_sequences: ['Customer:', 'Assistant:']
      },
      prompts: {
        greeting: 'Hello! I'm here to help you with any questions about our products.',
        fallback: 'I apologize, but I'm not sure about that. Would you like to speak with a human agent?'
      },
      active: true
    }
  ]);

  const [editingBot, setEditingBot] = useState<ChatBot | null>(null);

  const handleToggleActive = (id: string) => {
    setBots(bots.map(bot =>
      bot.id === id ? { ...bot, active: !bot.active } : bot
    ));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">AI Assistants</h3>
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Assistant</span>
          </button>
        </div>

        <div className="space-y-4">
          {bots.map(bot => (
            <div
              key={bot.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot size={20} className="text-primary-500" />
                  <div>
                    <h4 className="font-medium">{bot.name}</h4>
                    <p className="text-sm text-gray-500">{bot.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingBot(bot)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(bot.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    {bot.active ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Settings</h5>
                  <div className="space-y-1 text-gray-600">
                    <p>Model: {bot.settings.model}</p>
                    <p>Temperature: {bot.settings.temperature}</p>
                    <p>Max Tokens: {bot.settings.max_tokens}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Prompts</h5>
                  <div className="space-y-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Greeting</p>
                      <p className="text-gray-600">{bot.prompts.greeting}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Fallback</p>
                      <p className="text-gray-600">{bot.prompts.fallback}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bot.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bot.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}