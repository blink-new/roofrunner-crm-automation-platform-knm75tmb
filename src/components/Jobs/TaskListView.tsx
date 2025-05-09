import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Plus, Filter, Search, Clock, User, Tag } from 'lucide-react';
import { Task } from '../../types/jobs';

interface TaskListViewProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onTaskCreate: () => void;
  onTasksChange: (tasks: Task[]) => void;
}

export default function TaskListView({
  tasks,
  onTaskSelect,
  onTaskCreate,
  onTasksChange
}: TaskListViewProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    assignedTo: [] as string[],
    priority: [] as string[],
    tags: [] as string[]
  });

  const handleBulkAction = async (action: 'complete' | 'delete' | 'reassign') => {
    // Implement bulk actions
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tasks</h3>
          <button
            onClick={onTaskCreate}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-secondary inline-flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>

        {selectedTasks.length > 0 && (
          <div className="flex items-center justify-between py-2 border-t border-b border-gray-200">
            <span className="text-sm text-gray-600">
              {selectedTasks.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('complete')}
                className="btn btn-secondary text-sm"
              >
                Mark Complete
              </button>
              <button
                onClick={() => handleBulkAction('reassign')}
                className="btn btn-secondary text-sm"
              >
                Reassign
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn btn-secondary text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onTaskSelect(task)}
            >
              <input
                type="checkbox"
                checked={selectedTasks.includes(task.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  setSelectedTasks(prev =>
                    prev.includes(task.id)
                      ? prev.filter(id => id !== task.id)
                      : [...prev, task.id]
                  );
                }}
                className="mt-1 rounded border-gray-300"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  {task.due_date && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {task.assigned_to && (
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{task.assigned_to}</span>
                    </div>
                  )}
                  {task.tags?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag size={14} />
                      <div className="flex gap-1">
                        {task.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-gray-100 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}