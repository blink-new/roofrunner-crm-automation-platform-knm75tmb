import React from 'react';

const LeadSources: React.FC = () => {
  // In a real app, this would come from an API or state
  const data = [
    { source: 'Website', value: 35, color: 'bg-primary-500' },
    { source: 'Referral', value: 25, color: 'bg-secondary-500' },
    { source: 'Google', value: 20, color: 'bg-success-500' },
    { source: 'Facebook', value: 15, color: 'bg-accent-500' },
    { source: 'Other', value: 5, color: 'bg-gray-400' },
  ];
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <div className="flex h-full">
      <div className="w-1/2">
        <div className="relative w-full pt-[100%]">
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {data.reduce((acc, curr, index) => {
                const percentage = (curr.value / total) * 100;
                const previousPercentage = acc.previousPercentage || 0;
                const startAngle = (previousPercentage / 100) * 360;
                const angle = (percentage / 100) * 360;
                
                // SVG arc calculation
                const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
                const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
                const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * (Math.PI / 180));
                const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * (Math.PI / 180));
                
                // For angles > 180, we need to use the large-arc-flag
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                acc.elements.push(
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    className={curr.color.includes('bg-') ? curr.color.replace('bg-', 'fill-') : curr.color}
                  />
                );
                
                acc.previousPercentage = previousPercentage + percentage;
                return acc;
              }, { elements: [], previousPercentage: 0 }).elements}
            </svg>
          </div>
        </div>
      </div>
      
      <div className="w-1/2 pl-4 flex flex-col justify-center">
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <div className="flex justify-between w-full">
                <span className="text-sm text-gray-600">{item.source}</span>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadSources;