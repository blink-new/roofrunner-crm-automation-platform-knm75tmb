import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Card } from '../ui/card';
import { LeadScoringRule } from '../../types/contacts';

interface LeadScoringProps {
  onClose: () => void;
  onSave: (rule: Omit<LeadScoringRule, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
}

export default function LeadScoring({ onClose, onSave }: LeadScoringProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState<LeadScoringRule['conditions']>([]);
  const [points, setPoints] = useState(0);

  const handleSave = () => {
    onSave({
      name,
      description,
      conditions,
      points,
      active: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Scoring Rule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300"
              placeholder="e.g., Email Engagement"
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
              placeholder="Describe when this rule should apply"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Conditions</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <select className="rounded-md border-gray-300">
                  <option>Email Opened</option>
                  <option>Form Submitted</option>
                  <option>Deal Stage Changed</option>
                  <option>Custom Event</option>
                </select>
                <select className="rounded-md border-gray-300">
                  <option>equals</option>
                  <option>not equals</option>
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
                <span>Add Condition</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-32 rounded-md border-gray-300"
              placeholder="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              Points to add/subtract when conditions are met
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={!name || conditions.length === 0}
          >
            <Save size={16} />
            <span>Save Rule</span>
          </button>
        </div>
      </Card>
    </div>
  );
}