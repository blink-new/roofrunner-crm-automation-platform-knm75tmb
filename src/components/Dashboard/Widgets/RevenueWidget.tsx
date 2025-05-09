import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function RevenueWidget() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">$87.5K</div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
        </div>
        <div className="text-sm text-green-600 font-medium">
          +15% vs target
        </div>
      </div>

      <div className="h-[100px] flex items-end justify-between gap-1">
        {[65, 45, 75, 55, 80, 90].map((value, index) => (
          <div key={index} className="w-full">
            <div
              className="bg-primary-100 rounded-t relative group cursor-pointer"
              style={{ height: `${value}%` }}
            >
              <div className="absolute inset-x-0 bottom-0 bg-primary-500 h-1/3 rounded-b"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
}