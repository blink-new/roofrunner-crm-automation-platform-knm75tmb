import React from 'react';
import { HardHat } from 'lucide-react';

export default function JobsWidget() {
  const stats = [
    { label: 'Scheduled', count: 8, color: 'bg-blue-100 text-blue-800' },
    { label: 'In Progress', count: 3, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Completed', count: 12, color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
          <HardHat size={24} />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800">23</div>
          <div className="text-sm text-gray-500">Active Jobs</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${stat.color}`}>
              {stat.count}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}