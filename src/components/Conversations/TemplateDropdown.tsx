import React, { useState } from 'react';
import { FileText, ChevronDown, Plus, Edit2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
}

interface TemplateDropdownProps {
  onSelect: (content: string) => void;
  onCreateTemplate?: () => void;
}

export default function TemplateDropdown({ onSelect, onCreateTemplate }: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [templates] = useState<Template[]>([
    { id: '1', name: 'Welcome', content: 'Hi {name}, welcome to our service!', category: 'Greetings' },
    { id: '2', name: 'Follow-up', content: 'Just following up on our conversation...', category: 'Sales' },
    { id: '3', name: 'Thank You', content: 'Thank you for your business!', category: 'General' }
  ]);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
      >
        <FileText size={16} />
        <span className="text-sm">Templates</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          {categories.map(category => (
            <div key={category}>
              <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase">
                {category}
              </div>
              {templates
                .filter(t => t.category === category)
                .map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelect(template.content);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <span className="text-sm">{template.name}</span>
                    <Edit2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
            </div>
          ))}
          
          {onCreateTemplate && (
            <div className="border-t mt-2 pt-2">
              <button
                onClick={() => {
                  onCreateTemplate();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-primary-600 hover:text-primary-700 flex items-center gap-2"
              >
                <Plus size={14} />
                <span className="text-sm">Create Template</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}