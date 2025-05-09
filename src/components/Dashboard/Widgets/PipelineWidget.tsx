import React from 'react';

export default function PipelineWidget() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-500">Pipeline Overview</div>
        <div className="mt-2 grid gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">Lead</div>
              <div className="text-xs text-gray-500">5 deals</div>
            </div>
            <div className="text-sm font-medium text-gray-900">$25,000</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">Qualified</div>
              <div className="text-xs text-gray-500">3 deals</div>
            </div>
            <div className="text-sm font-medium text-gray-900">$45,000</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">Closing</div>
              <div className="text-xs text-gray-500">2 deals</div>
            </div>
            <div className="text-sm font-medium text-gray-900">$30,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}