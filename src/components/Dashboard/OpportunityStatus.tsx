import React from 'react';

const OpportunityStatus: React.FC = () => {
  // In a real app, this would come from an API or state
  const totalCount = 140;
  const data = [
    { label: 'Open', value: 80, color: 'bg-primary-400' },
    { label: 'Lost', value: 30, color: 'bg-error-500' },
    { label: 'Won', value: 30, color: 'bg-success-500' },
  ];
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 mb-4">
        {/* Donut chart */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          
          {/* Dynamic segments */}
          {data.map((segment, index) => {
            const total = data.reduce((acc, curr) => acc + curr.value, 0);
            const startAngle = data
              .slice(0, index)
              .reduce((acc, curr) => acc + (curr.value / total) * 360, 0);
            const angle = (segment.value / total) * 360;
            
            // SVG arc calculation
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
            const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * (Math.PI / 180));
            const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * (Math.PI / 180));
            
            // For angles > 180, we need to use the large-arc-flag
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                fill="none"
                stroke={segment.color.replace('bg-', '')}
                strokeWidth="12"
                className={segment.color.includes('bg-') ? segment.color.replace('bg-', 'stroke-') : segment.color}
              />
            );
          })}
          
          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold text-2xl"
            fill="#374151"
          >
            {totalCount}
          </text>
        </svg>
        
        {/* Placeholder visualization */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0">
          <div className="text-3xl font-bold">{totalCount}</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${item.color} mr-1.5`}></div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-green-600">+100% vs last 30 days</p>
      </div>
    </div>
  );
};

export default OpportunityStatus;