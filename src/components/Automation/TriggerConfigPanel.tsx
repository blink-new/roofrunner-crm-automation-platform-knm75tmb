import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Save, Plus, Trash2, X } from 'lucide-react';
import { Node } from '../../types/automations';
import { WorkflowService } from '../../lib/services/WorkflowService';

interface TriggerConfigPanelProps {
  workflowId: string;
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
  onClose: () => void;
}

export default function TriggerConfigPanel({
  workflowId,
  node,
  onUpdate,
  onClose
}: TriggerConfigPanelProps) {
  const [triggerType, setTriggerType] = useState(node.data.type || 'contact.created');
  const [filters, setFilters] = useState<Array<{
    field: string;
    operator: string;
    value: string;
  }>>(node.data.filters || []);
  const [isSaving, setIsSaving] = useState(false);

  const triggerTypes = [
    { value: 'contact.created', label: 'Contact Created' },
    { value: 'contact.updated', label: 'Contact Updated' },
    { value: 'contact.tag_added', label: 'Tag Added to Contact' },
    { value: 'contact.tag_removed', label: 'Tag Removed from Contact' },
    { value: 'deal.created', label: 'Deal Created' },
    { value: 'deal.stage_changed', label: 'Deal Stage Changed' },
    { value: 'deal.won', label: 'Deal Won' },
    { value: 'deal.lost', label: 'Deal Lost' },
    { value: 'conversation.message_received', label: 'Message Received' },
    { value: 'conversation.unread', label: 'Unread Conversation' },
    { value: 'event.created', label: 'Event Created' },
    { value: 'event.reminder', label: 'Event Reminder' },
    { value: 'task.added', label: 'Task Added' },
    { value: 'task.completed', label: 'Task Completed' },
    { value: 'task.reminder', label: 'Task Reminder' },
    { value: 'manual', label: 'Manual Trigger' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does not contain' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' },
    { value: 'in', label: 'In list' },
    { value: 'not_in', label: 'Not in list' }
  ];

  const getFieldOptions = () => {
    // Return different field options based on trigger type
    if (triggerType.startsWith('contact.')) {
      return [
        { value: 'first_name', label: 'First Name' },
        { value: 'last_name', label: 'Last Name' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'type', label: 'Type' },
        { value: 'tags', label: 'Tags' }
      ];
    } else if (triggerType.startsWith('deal.')) {
      return [
        { value: 'name', label: 'Deal Name' },
        { value: 'amount', label: 'Amount' },
        { value: 'stage', label: 'Stage' },
        { value: 'owner', label: 'Owner' },
        { value: 'tags', label: 'Tags' }
      ];
    } else if (triggerType.startsWith('task.')) {
      return [
        { value: 'title', label: 'Title' },
        { value: 'status', label: 'Status' },
        { value: 'priority', label: 'Priority' },
        { value: 'assigned_to', label: 'Assigned To' }
      ];
    }
    
    return [
      { value: 'id', label: 'ID' },
      { value: 'name', label: 'Name' }
    ];
  };

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<typeof filters[0]>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updatedData = {
        ...node.data,
        type: triggerType,
        filters
      };
      
      await WorkflowService.updateTrigger(workflowId, node.id, updatedData);
      onUpdate(node.id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error saving trigger:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Configure Trigger</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger Type
            </label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="w-full rounded-md border-gray-300"
            >
              {triggerTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Filters
              </label>
              <button
                onClick={addFilter}
                className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Filter</span>
              </button>
            </div>

            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(index, { field: e.target.value })}
                    className="rounded-md border-gray-300"
                  >
                    <option value="">Select field</option>
                    {getFieldOptions().map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, { operator: e.target.value })}
                    className="rounded-md border-gray-300"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>

                  {filter.operator === 'between' ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={filter.value.split(',')[0] || ''}
                        onChange={(e) => {
                          const [_, max] = filter.value.split(',');
                          updateFilter(index, { value: `${e.target.value},${max || ''}` });
                        }}
                        className="flex-1 rounded-md border-gray-300"
                        placeholder="Min"
                      />
                      <span>and</span>
                      <input
                        type="text"
                        value={filter.value.split(',')[1] || ''}
                        onChange={(e) => {
                          const [min] = filter.value.split(',');
                          updateFilter(index, { value: `${min || ''},${e.target.value}` });
                        }}
                        className="flex-1 rounded-md border-gray-300"
                        placeholder="Max"
                      />
                    </div>
                  ) : filter.operator === 'in' || filter.operator === 'not_in' ? (
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder="Comma-separated values"
                    />
                  ) : (
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder="Value"
                    />
                  )}

                  <button
                    onClick={() => removeFilter(index)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {filters.length === 0 && (
                <p className="text-sm text-gray-500">
                  No filters applied. This trigger will fire for all {triggerType.split('.')[0]}s.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}