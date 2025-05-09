import React from 'react';
import RecentTasks from './RecentTasks';
import QuickLinks from './QuickLinks';

const ActivityAndQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
      <div className="card h-full">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-700">Recent Tasks</h2>
        </div>
        <div className="p-4">
          <RecentTasks />
        </div>
      </div>
      
      <div className="card h-full">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-700">Quick Links</h2>
        </div>
        <div className="p-4">
          <QuickLinks />
        </div>
      </div>
    </div>
  );
};

export default ActivityAndQuickActions;