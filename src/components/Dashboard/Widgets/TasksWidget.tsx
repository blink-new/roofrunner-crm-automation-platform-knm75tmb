import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function TasksWidget() {
  const tasks = [
    {
      id: '1',
      title: 'Follow up with client',
      due: 'Today',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Review proposal',
      due: 'Tomorrow',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Send invoice',
      due: 'Yesterday',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-start p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="mr-3 mt-0.5">
            {task.status === 'completed' ? (
              <CheckCircle size={18} className="text-success-500" />
            ) : (
              <Clock size={18} className="text-warning-500" />
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm ${
              task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}>
              {task.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">Due: {task.due}</p>
          </div>
        </div>
      ))}
    </div>
  );
}