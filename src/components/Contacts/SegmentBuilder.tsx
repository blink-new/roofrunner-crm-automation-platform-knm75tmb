import React, { useState } from 'react';
import { X, Plus, Save, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { ContactFilters, Segment } from '../../types/contacts';

interface SegmentBuilderProps {
  onClose: () => void;
  onSave: (segment: Omit<Segment, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
}

export default function SegmentBuilder({ onClose, onSave }: SegmentBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filters, setFilters] = useState<ContactFilters>({});

  const handleSave = () => {
    onSave({
      name,
      description,
      filters,
      count: 0 // This will be calculated on the server
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Segment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segment Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300"
              placeholder="e.g., High Value Customers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300"
              rows={3}
              placeholder="Describe the purpose of this segment"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <select className="rounded-md border-gray-300">
                  <option>Type</option>
                  <option>Tags</option>
                  <option>Lead Score</option>
                  <option>Custom Field</option>
                </select>
                <select className="rounded-md border-gray-300">
                  <option>is</option>
                  <option>is not</option>
                  <option>contains</option>
                  <option>greater than</option>
                  <option>less than</option>
                </select>
                <input
                  type="text"
                  className="flex-1 rounded-md border-gray-300"
                  placeholder="Value"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              <button className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                <Plus size={16} />
                <span>Add Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={!name}
          >
            <Save size={16} />
            <span>Save Segment</span>
          </button>
        </div>
      </Card>
    </div>
  );
}