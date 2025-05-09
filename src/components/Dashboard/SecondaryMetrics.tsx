import React from 'react';
import StageDistribution from './StageDistribution';
import RevenueTrend from './RevenueTrend';
import LeadSources from './LeadSources';

const SecondaryMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <div className="card h-full">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-700">Stage Distribution</h2>
          </div>
          <div className="p-4">
            <StageDistribution />
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <div className="card h-full">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-700">Revenue Trend</h2>
          </div>
          <div className="p-4">
            <RevenueTrend />
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-6">
        <div className="card h-full">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-700">Lead Sources</h2>
          </div>
          <div className="p-4">
            <LeadSources />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryMetrics;