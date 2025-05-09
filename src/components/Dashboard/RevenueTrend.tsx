import React from 'react';

const RevenueTrend: React.FC = () => {
  // In a real app, this would come from an API or state
  const data = [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 25 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 30 },
    { month: 'May', value: 22 },
    { month: 'Jun', value: 38 },
  ];
  
  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = 120;
  
  return (
    <div className="h-full flex items-end">
      <div className="w-full flex items-end justify-between gap-1 h-[130px]">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * chartHeight;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-8 bg-primary-100 rounded-t relative group cursor-pointer"
                style={{ height: `${height}px` }}
              >
                <div className="absolute inset-x-0 bottom-0 bg-primary-500 h-1/3 rounded-b"></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${item.value}K
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueTrend;