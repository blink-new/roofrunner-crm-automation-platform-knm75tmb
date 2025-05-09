import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';

interface BufferRule {
  id: string;
  service_id: string;
  buffer_before: number;
  buffer_after: number;
  applies_to: 'all' | 'specific_days';
  days?: number[];
}

export default function BufferSettings() {
  const [bufferRules, setBufferRules] = useState<BufferRule[]>([
    {
      id: '1',
      service_id: '1',
      buffer_before: 15,
      buffer_after: 30,
      applies_to: 'all'
    },
    {
      id: '2',
      service_id: '2',
      buffer_before: 30,
      buffer_after: 45,
      applies_to: 'specific_days',
      days: [1, 2, 3] // Monday, Tuesday, Wednesday
    }
  ]);

  const [editingRule, setEditingRule] = useState<BufferRule | null>(null);

  const weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Buffer Times</h3>
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>Add Buffer Rule</span>
          </button>
        </div>

        <div className="space-y-4">
          {bufferRules.map(rule => (
            <div
              key={rule.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-primary-500" />
                  <div>
                    <h4 className="font-medium">Service Name</h4>
                    <p className="text-sm text-gray-500">
                      {rule.applies_to === 'all' ? 'All days' : 'Specific days'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buffer Before
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rule.buffer_before}
                      className="w-20 rounded-md border-gray-300"
                      min="0"
                      step="5"
                    />
                    <span className="text-sm text-gray-500">minutes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buffer After
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rule.buffer_after}
                      className="w-20 rounded-md border-gray-300"
                      min="0"
                      step="5"
                    />
                    <span className="text-sm text-gray-500">minutes</span>
                  </div>
                </div>
              </div>

              {rule.applies_to === 'specific_days' && rule.days && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applies to Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekdays.map((day, index) => (
                      <label
                        key={day}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          checked={rule.days.includes(index + 1)}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}