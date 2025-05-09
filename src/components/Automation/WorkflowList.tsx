import React, { useState } from 'react';
import { Play, Pause, Clock, Activity, Copy, Trash2, Plus, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { Workflow } from '../../types/automations';

interface WorkflowListProps {
  onSelect: (workflow: Workflow) => void;
  onNew: () => void;
  onBulkAction: (action: 'enable' | 'disable' | 'clone' | 'delete', ids: string[]) => void;
  workflows: Workflow[];
  loading: boolean;
}

export default function WorkflowList({
  onSelect,
  onNew,
  onBulkAction,
  workflows,
  loading
}: WorkflowListProps) {
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const filteredWorkflows = workflows.filter(workflow => {
    if (filterActive === null) return true;
    return workflow.active === filterActive;
  });

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows.map(w => w.id));
    }
  };

  const handleSelectWorkflow = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedWorkflows([...selectedWorkflows, id]);
    } else {
      setSelectedWorkflows(selectedWorkflows.filter(wId => wId !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer animate-pulse"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>

              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))
      ) : filteredWorkflows.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workflows found
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first workflow to automate your business processes
          </p>
          <button
            onClick={onNew}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Workflow</span>
          </button>
        </div>
      ) : (
        <>
          {selectedWorkflows.length > 0 && (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedWorkflows.length} workflow{selectedWorkflows.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onBulkAction('enable', selectedWorkflows)}
                  className="btn btn-secondary text-sm"
                >
                  Enable
                </button>
                <button
                  onClick={() => onBulkAction('disable', selectedWorkflows)}
                  className="btn btn-secondary text-sm"
                >
                  Disable
                </button>
                <button
                  onClick={() => onBulkAction('clone', selectedWorkflows)}
                  className="btn btn-secondary text-sm"
                >
                  Clone
                </button>
                <button
                  onClick={() => onBulkAction('delete', selectedWorkflows)}
                  className="btn btn-secondary text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {filteredWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(workflow)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedWorkflows.includes(workflow.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectWorkflow(workflow.id, e.target.checked);
                      }}
                      className="rounded border-gray-300 text-primary-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h3 className="font-medium">{workflow.name}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBulkAction(
                        workflow.active ? 'disable' : 'enable',
                        [workflow.id]
                      );
                    }}
                    className={`p-2 rounded-full ${
                      workflow.active
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {workflow.active ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {workflow.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {workflow.last_run
                        ? `Last run: ${new Date(workflow.last_run).toLocaleDateString()}`
                        : 'Never run'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={14} />
                    <span>
                      {workflow.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}