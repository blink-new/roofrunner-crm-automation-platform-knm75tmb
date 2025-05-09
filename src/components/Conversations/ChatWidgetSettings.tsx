import React, { useState } from 'react';
import { Card } from '../ui/card';
import { MessageSquare, Plus, Edit2, Trash2, Copy } from 'lucide-react';

interface ChatWidget {
  id: string;
  name: string;
  settings: {
    theme: {
      primary_color: string;
      text_color: string;
    };
    welcome_message: string;
    position: 'left' | 'right';
    show_branding: boolean;
  };
  embed_code: string;
  active: boolean;
}

export default function ChatWidgetSettings() {
  const [widgets, setWidgets] = useState<ChatWidget[]>([
    {
      id: '1',
      name: 'Main Website',
      settings: {
        theme: {
          primary_color: '#3B82F6',
          text_color: '#FFFFFF'
        },
        welcome_message: 'Hi there! How can we help you today?',
        position: 'right',
        show_branding: false
      },
      embed_code: '<script src="https://chat.example.com/widget/1"></script>',
      active: true
    }
  ]);

  const [editingWidget, setEditingWidget] = useState<ChatWidget | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleToggleActive = (id: string) => {
    setWidgets(widgets.map(widget =>
      widget.id === id ? { ...widget, active: !widget.active } : widget
    ));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Chat Widgets</h3>
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Widget</span>
          </button>
        </div>

        <div className="space-y-4">
          {widgets.map(widget => (
            <div
              key={widget.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-primary-500" />
                  <div>
                    <h4 className="font-medium">{widget.name}</h4>
                    <p className="text-sm text-gray-500">
                      Theme: {widget.settings.theme.primary_color}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingWidget(widget)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleCopyCode(widget.embed_code)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Copy size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <p>Welcome Message: {widget.settings.welcome_message}</p>
                  <p>Position: {widget.settings.position}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widget.active}
                    onChange={() => handleToggleActive(widget.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-600">{widget.embed_code}</code>
                  <button
                    onClick={() => handleCopyCode(widget.embed_code)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Copy
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