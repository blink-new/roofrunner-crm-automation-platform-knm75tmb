import React, { useState } from 'react';
import { Search, Star, Bell, Filter, Plus, Trash, Archive, UserPlus } from 'lucide-react';
import { Thread } from '../../types/conversations';
import ThreadItem from './ThreadItem';
import ThreadSkeleton from './ThreadSkeleton';
import SidePanel from './SidePanel';

interface ThreadListProps {
  threads: Thread[];
  selectedThread: Thread | null;
  onThreadSelect: (thread: Thread) => void;
  showFilterPanel: boolean;
  onCloseFilterPanel: () => void;
  searchQuery: string;
  selectedThreads: string[];
  onSelectThreads: (ids: string[]) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ 
  threads, 
  selectedThread, 
  onThreadSelect,
  showFilterPanel,
  onCloseFilterPanel,
  searchQuery,
  selectedThreads,
  onSelectThreads
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'unread', label: 'Unread' },
    { id: 'recents', label: 'Recents' },
    { id: 'starred', label: 'Starred' },
    { id: 'all', label: 'All' }
  ];

  const handleSelectAll = () => {
    if (selectedThreads.length === threads.length) {
      onSelectThreads([]);
    } else {
      onSelectThreads(threads.map(t => t.id));
    }
  };

  const handleBulkAction = (action: 'archive' | 'delete' | 'assign') => {
    // Implement bulk actions
    console.log(`Bulk ${action}:`, selectedThreads);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {selectedThreads.length > 0 && (
          <div className="flex items-center justify-between py-2 border-t border-b border-gray-200 mb-4">
            <span className="text-sm text-gray-600">
              {selectedThreads.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('archive')}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                title="Archive selected"
              >
                <Archive size={16} />
              </button>
              <button
                onClick={() => handleBulkAction('assign')}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                title="Assign to user"
              >
                <UserPlus size={16} />
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                title="Delete selected"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <ThreadSkeleton key={index} />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start a new conversation to connect with your customers
            </p>
            <button className="btn btn-primary">
              New Conversation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {threads.map(thread => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={selectedThread?.id === thread.id}
                onClick={() => onThreadSelect(thread)}
                onSelect={(selected) => {
                  onSelectThreads(
                    selected
                      ? [...selectedThreads, thread.id]
                      : selectedThreads.filter(id => id !== thread.id)
                  );
                }}
                isChecked={selectedThreads.includes(thread.id)}
              />
            ))}
          </div>
        )}
      </div>

      <SidePanel
        isOpen={showFilterPanel}
        onClose={onCloseFilterPanel}
        title="Filters"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Channel</h4>
            <div className="space-y-2">
              {['Email', 'SMS', 'Chat'].map((channel) => (
                <label key={channel} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
            <div className="space-y-2">
              {['Unread', 'Read', 'Archived'].map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Assigned To</h4>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
              <option value="">Anyone</option>
              <option value="me">Assigned to me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Date Range</h4>
            <div className="space-y-2">
              <input
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </SidePanel>
    </div>
  );
};

export default ThreadList;