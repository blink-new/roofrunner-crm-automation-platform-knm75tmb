import React from 'react';

const ConversionRate: React.FC = () => {
  // In a real app, this would come from an API or state
  const rate = "0.71%";
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-800">{rate}</div>
      </div>
      
      {/* Mini donut chart */}
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="12"
            strokeDasharray="251.2"
            strokeDashoffset="235"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>
      
      <div className="mt-auto text-center">
        <p className="text-sm font-medium text-green-600">+100% vs last 30 days</p>
      </div>
    </div>
  );
};

export default ConversionRate;