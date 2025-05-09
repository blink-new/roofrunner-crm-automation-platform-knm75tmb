import React from 'react';
import { DollarSign } from 'lucide-react';

export default function OpportunitiesWidget() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">$45.2K</div>
            <div className="text-sm text-gray-500">Total Value</div>
          </div>
        </div>
        <div className="text-sm text-green-600 font-medium">
          +8% vs last month
        </div>
      </div>

      <div className="space-y-2">
        {[
          { label: 'New', value: 12, amount: '$15.5K' },
          { label: 'Qualified', value: 8, amount: '$12.8K' },
          { label: 'Proposal', value: 5, amount: '$16.9K' }
        ].map((stage, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{stage.label}</span>
                <span className="text-sm font-medium">{stage.amount}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(stage.value / 25) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}