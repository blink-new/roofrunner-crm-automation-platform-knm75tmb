import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Bell, Clock, User, Tag, X, Plus, MessageSquare } from 'lucide-react';
import { Task } from '../../types/jobs';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function TaskDetail({
  task,
  onClose,
  onUpdate,
  onDelete
}: TaskDetailProps) {
  const [reminders, setReminders] = useState(task.reminders || []);

  const addReminder = (type: 'email' | 'sms', minutes: number) => {
    const newReminders = [...reminders, { type, minutes }];
    setReminders(newReminders);
    onUpdate({ reminders: newReminders });
  };

  const removeReminder = (index: number) => {
    const newReminders = reminders.filter((_, i) => i !== index);
    setReminders(newReminders);
    onUpdate({ reminders: newReminders });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Task Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={task.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="w-full rounded-md border-gray-300"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={task.due_date}
                onChange={(e) => onUpdate({ due_date: e.target.value })}
                className="w-full rounded-md border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => onUpdate({ status: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              value={task.assigned_to || ''}
              onChange={(e) => onUpdate({ assigned_to: e.target.value })}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">Unassigned</option>
              <option value="user1">John Doe</option>
              <option value="user2">Jane Smith</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminders
            </label>
            <div className="space-y-2">
              {reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {reminder.type === 'email' ? 'Email' : 'SMS'} reminder
                      {' '}{reminder.minutes} minutes before
                    </span>
                  </div>
                  <button
                    onClick={() => removeReminder(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addReminder('email', 30)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus size={16} className="inline mr-1" />
                Add Reminder
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare size={16} className="text-gray-400 mt-1" />
                <textarea
                  placeholder="Add a note..."
                  className="flex-1 resize-none border-0 bg-transparent p-0 focus:ring-0"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={onDelete}
            className="btn btn-secondary text-red-600 hover:text-red-700"
          >
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Card>
  );
}