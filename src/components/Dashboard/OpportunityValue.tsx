import React from 'react';

const OpportunityValue: React.FC = () => {
  // In a real app, this would come from an API or state
  const totalValue = "$87.95K";
  const data = [
    { label: 'Open', value: 45000, color: 'bg-primary-400' },
    { label: 'Lost', value: 15000, color: 'bg-error-500' },
    { label: 'Won', value: 27950, color: 'bg-success-500' },
  ];
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <div className="flex flex-col">
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-800">{totalValue}</div>
      </div>
      
      {/* Horizontal bar chart */}
      <div className="space-y-2 mb-4">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          
          return (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
                <span className="text-xs font-medium text-gray-600">
                  ${(item.value / 1000).toFixed(1)}K
                </span>
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
      
      <div className="mt-auto text-center">
        <p className="text-sm font-medium text-green-600">+100% vs last 30 days</p>
      </div>
    </div>
  );
};

export default OpportunityValue;