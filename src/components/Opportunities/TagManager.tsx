import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card } from '../ui/card';

interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

export default function TagManager({ tags, onChange, suggestions = [] }: TagManagerProps) {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag)) return;
    onChange([...tags, tag.trim()]);
    setNewTag('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions.filter(
    tag => !tags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="p-0.5 hover:bg-gray-200 rounded-full"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(newTag);
                }
              }}
              placeholder="Add tag..."
              className="flex-1 px-3 py-1 text-sm border rounded-md"
            />
            <button
              onClick={() => handleAddTag(newTag)}
              disabled={!newTag.trim()}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleAddTag(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}