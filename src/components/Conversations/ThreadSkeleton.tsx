import React from 'react';

const ThreadSkeleton: React.FC = () => {
  return (
    <div className="flex items-center p-3 h-[72px] animate-pulse">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200" />
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        
        <div className="flex items-center">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="ml-2 h-4 bg-gray-200 rounded-full w-6" />
        </div>
      </div>
    </div>
  );
};

export default ThreadSkeleton;