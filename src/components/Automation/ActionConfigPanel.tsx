import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Save, X } from 'lucide-react';
import { Node } from '../../types/automations';
import { WorkflowService } from '../../lib/services/WorkflowService';

interface ActionConfigPanelProps {
  workflowId: string;
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
  onClose: () => void;
}

export default function ActionConfigPanel({
  workflowId,
  node,
  onUpdate,
  onClose
}: ActionConfigPanelProps) {
  const [actionType, setActionType] = useState(node.data.type || 'email.send');
  const [config, setConfig] = useState(node.data.config || {});
  const [isSaving, setIsSaving] = useState(false);

  const actionTypes = [
    { value: 'email.send', label: 'Send Email', category: 'Communication' },
    { value: 'sms.send', label: 'Send SMS', category: 'Communication' },
    { value: 'task.create', label: 'Create Task', category: 'Tasks' },
    { value: 'task.notification', label: 'Task Notification', category: 'Tasks' },
    { value: 'field.update', label: 'Update Field', category: 'Data' },
    { value: 'tag.add', label: 'Add Tag', category: 'Data' },
    { value: 'tag.remove', label: 'Remove Tag', category: 'Data' },
    { value: 'deal.create', label: 'Create Deal', category: 'Sales' },
    { value: 'deal.update', label: 'Update Deal', category: 'Sales' },
    { value: 'webhook.call', label: 'Call Webhook', category: 'Premium' },
    { value: 'custom_code', label: 'Custom Code', category: 'Premium' },
    { value: 'google_sheets.update', label: 'Update Google Sheet', category: 'Premium' },
    { value: 'slack.send', label: 'Send Slack Message', category: 'Premium' },
    { value: 'delay', label: 'Delay', category: 'Flow' },
    { value: 'if', label: 'If/Else Condition', category: 'Flow' },
    { value: 'switch', label: 'Switch', category: 'Flow' },
    { value: 'goal', label: 'Goal', category: 'Flow' }
  ];

  const groupedActionTypes = actionTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, typeof actionTypes>);

  const renderConfigFields = () => {
    switch (actionType) {
      case 'email.send':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="text"
                value={config.to || ''}
                onChange={(e) => setConfig({ ...config, to: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="{'{{contact.email}}'}"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use {'{{contact.email}}'} to use the contact's email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={config.subject || ''}
                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body
              </label>
              <textarea
                value={config.body || ''}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={5}
                placeholder="Email body"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use {'{{contact.first_name}}'} to personalize the email
              </p>
            </div>
          </>
        );

      case 'sms.send':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="text"
                value={config.to || ''}
                onChange={(e) => setConfig({ ...config, to: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="{'{{contact.phone}}'}"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use {'{{contact.phone}}'} to use the contact's phone number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={config.message || ''}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={3}
                placeholder="SMS message"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use {'{{contact.first_name}}'} to personalize the message
              </p>
            </div>
          </>
        );

      case 'task.create':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="Task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={3}
                placeholder="Task description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <select
                value={config.due_date_type || 'specific'}
                onChange={(e) => setConfig({ ...config, due_date_type: e.target.value })}
                className="w-full rounded-md border-gray-300 mb-2"
              >
                <option value="specific">Specific Date</option>
                <option value="relative">Relative Date</option>
              </select>

              {config.due_date_type === 'specific' ? (
                <input
                  type="date"
                  value={config.due_date || ''}
                  onChange={(e) => setConfig({ ...config, due_date: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.due_date_days || 1}
                    onChange={(e) => setConfig({ ...config, due_date_days: Number(e.target.value) })}
                    className="w-20 rounded-md border-gray-300"
                    min="1"
                  />
                  <span className="text-gray-700">days from now</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                value={config.assigned_to || ''}
                onChange={(e) => setConfig({ ...config, assigned_to: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="">Unassigned</option>
                <option value="{'{{trigger.user_id}}'}">Trigger User</option>
                <option value="{'{{contact.owner_id}}'}">Contact Owner</option>
                <option value="user1">John Doe</option>
                <option value="user2">Jane Smith</option>
              </select>
            </div>
          </>
        );

      case 'webhook.call':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={config.url || ''}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="https://example.com/webhook"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={config.method || 'POST'}
                onChange={(e) => setConfig({ ...config, method: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headers
              </label>
              <textarea
                value={config.headers || ''}
                onChange={(e) => setConfig({ ...config, headers: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={3}
                placeholder='{"Content-Type": "application/json"}'
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter headers as JSON
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body
              </label>
              <textarea
                value={config.body || ''}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={5}
                placeholder='{"key": "value"}'
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter body as JSON. Use {'{{variables}}'} for dynamic values.
              </p>
            </div>
          </>
        );

      case 'custom_code':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <textarea
                value={config.code || ''}
                onChange={(e) => setConfig({ ...config, code: e.target.value })}
                className="w-full rounded-md border-gray-300 font-mono"
                rows={10}
                placeholder="// Write your custom JavaScript code here
// Example:
// const contact = data.contact;
// contact.custom_fields.score = 100;
// return { contact };
"
              />
              <p className="mt-1 text-xs text-gray-500">
                Write JavaScript code to process the workflow data
              </p>
            </div>
          </>
        );

      case 'if':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Field
              </label>
              <input
                type="text"
                value={config.field || ''}
                onChange={(e) => setConfig({ ...config, field: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="{'{{contact.type}}'}"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use {'{{variables}}'} to reference workflow data
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator
              </label>
              <select
                value={config.operator || 'equals'}
                onChange={(e) => setConfig({ ...config, operator: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Does not equal</option>
                <option value="contains">Contains</option>
                <option value="not_contains">Does not contain</option>
                <option value="greater_than">Greater than</option>
                <option value="less_than">Less than</option>
                <option value="is_empty">Is empty</option>
                <option value="is_not_empty">Is not empty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={config.value || ''}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="Value to compare against"
              />
            </div>
          </>
        );

      case 'switch':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Switch Field
              </label>
              <input
                type="text"
                value={config.field || ''}
                onChange={(e) => setConfig({ ...config, field: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="{'{{contact.type}}'}"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use {'{{variables}}'} to reference workflow data
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cases
              </label>
              <div className="space-y-2">
                {(config.cases || []).map((caseItem: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={caseItem.value}
                      onChange={(e) => {
                        const newCases = [...(config.cases || [])];
                        newCases[index] = { ...caseItem, value: e.target.value };
                        setConfig({ ...config, cases: newCases });
                      }}
                      className="flex-1 rounded-md border-gray-300"
                      placeholder="Case value"
                    />
                    <button
                      onClick={() => {
                        const newCases = [...(config.cases || [])];
                        newCases.splice(index, 1);
                        setConfig({ ...config, cases: newCases });
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newCases = [...(config.cases || []), { value: '' }];
                    setConfig({ ...config, cases: newCases });
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Add Case
                </button>
              </div>
            </div>
          </>
        );

      case 'delay':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay Type
              </label>
              <select
                value={config.delay_type || 'fixed'}
                onChange={(e) => setConfig({ ...config, delay_type: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="fixed">Fixed Time</option>
                <option value="until">Until Specific Date</option>
              </select>
            </div>

            {config.delay_type === 'fixed' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="number"
                    value={config.duration || 1}
                    onChange={(e) => setConfig({ ...config, duration: Number(e.target.value) })}
                    className="w-full rounded-md border-gray-300"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={config.unit || 'minutes'}
                    onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Field
                </label>
                <input
                  type="text"
                  value={config.date_field || ''}
                  onChange={(e) => setConfig({ ...config, date_field: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="{'{{contact.custom_fields.follow_up_date}}'}"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use {'{{variables}}'} to reference a date field
                </p>
              </div>
            )}
          </>
        );

      case 'goal':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="e.g., Contact Converted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={3}
                placeholder="Describe what this goal represents"
              />
            </div>
          </>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            Select an action type to configure
          </div>
        );
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updatedData = {
        ...node.data,
        type: actionType,
        config
      };
      
      await WorkflowService.updateAction(workflowId, node.id, updatedData);
      onUpdate(node.id, updatedData);
      onClose();
    } catch (error) {
      console.error('Error saving action:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Configure Action</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full rounded-md border-gray-300"
            >
              {Object.entries(groupedActionTypes).map(([category, types]) => (
                <optgroup key={category} label={category}>
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {renderConfigFields()}
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