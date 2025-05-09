import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const Funnel: React.FC = () => {
  // In a real app, this would come from an API or state
  const value = "$1.75K";
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Filter size={24} className="text-primary-500" />
        <div className="text-3xl font-bold text-gray-800">{value}</div>
      </div>
      
      <div className="mt-auto">
        <button className="w-full btn btn-secondary flex items-center justify-between">
          <span>Customer Pipeline</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default Funnel;