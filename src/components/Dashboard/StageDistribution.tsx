import React from 'react';

const StageDistribution: React.FC = () => {
  // In a real app, this would come from an API or state
  const data = [
    { stage: 'Lead', count: 95, color: 'bg-primary-300' },
    { stage: 'Qualified', count: 65, color: 'bg-primary-400' },
    { stage: 'Proposal', count: 45, color: 'bg-primary-500' },
    { stage: 'Negotiation', count: 30, color: 'bg-primary-600' },
    { stage: 'Closed', count: 20, color: 'bg-primary-700' },
  ];
  
  const maxCount = Math.max(...data.map(item => item.count));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.count / maxCount) * 100;
        
        return (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">{item.stage}</span>
              <span className="text-xs font-medium text-gray-600">{item.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StageDistribution;