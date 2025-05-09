import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Card } from '../ui/card';
import TagManager from './TagManager';
import SourcePicker from './SourcePicker';

interface BulkEditModalProps {
  onClose: () => void;
  onSave: (updates: Record<string, any>) => Promise<void>;
  selectedCount: number;
}

export default function BulkEditModal({
  onClose,
  onSave,
  selectedCount
}: BulkEditModalProps) {
  const [updates, setUpdates] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (Object.keys(updates).length === 0) return;
    
    try {
      setIsSubmitting(true);
      await onSave(updates);
      onClose();
    } catch (error) {
      console.error('Error applying bulk updates:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Bulk Edit ({selectedCount} opportunities)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage
            </label>
            <select
              value={updates.stage_id || ''}
              onChange={(e) => setUpdates({ ...updates, stage_id: e.target.value })}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">No change</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner
            </label>
            <select
              value={updates.owner_id || ''}
              onChange={(e) => setUpdates({ ...updates, owner_id: e.target.value })}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">No change</option>
              <option value="user1">John Doe</option>
              <option value="user2">Jane Smith</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <SourcePicker
              value={updates.source || ''}
              onChange={(source) => setUpdates({ ...updates, source })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <TagManager
              tags={updates.tags || []}
              onChange={(tags) => setUpdates({ ...updates, tags })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            disabled={isSubmitting || Object.keys(updates).length === 0}
          >
            <Save size={16} className="inline-block mr-2" />
            Apply Changes
          </button>
        </div>
      </Card>
    </div>
  );
}