import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const RecentTasks: React.FC = () => {
  // In a real app, this would come from an API or state
  const tasks = [
    {
      id: 1,
      title: 'Follow up with John Doe about roof inspection',
      status: 'pending',
      dueDate: 'Today',
    },
    {
      id: 2,
      title: 'Schedule installation for 123 Main St',
      status: 'completed',
      dueDate: 'Yesterday',
    },
    {
      id: 3,
      title: 'Send estimate to Smith family',
      status: 'pending',
      dueDate: 'Tomorrow',
    },
    {
      id: 4,
      title: 'Order materials for Johnson project',
      status: 'pending',
      dueDate: 'Aug 15',
    },
    {
      id: 5,
      title: 'Review marketing campaign results',
      status: 'completed',
      dueDate: 'Aug 10',
    },
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
            <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
          </div>
          <div className="ml-4">
            <span className={`badge ${
              task.status === 'completed' 
                ? 'bg-success-50 text-success-700' 
                : 'bg-warning-50 text-warning-700'
            }`}>
              {task.status === 'completed' ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTasks;