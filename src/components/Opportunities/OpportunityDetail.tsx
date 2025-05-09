import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';

export default function OpportunityDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Opportunities', path: '/opportunities' },
            { label: 'Opportunity Details', path: `/opportunities/${id}`, active: true }
          ]}
        />
        <h1 className="mt-2">Opportunity Details</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Opportunity Name</h3>
              <p className="mt-1 text-lg">Loading...</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Value</h3>
              <p className="mt-1 text-lg">Loading...</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Stage</h3>
              <p className="mt-1 text-lg">Loading...</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expected Close Date</h3>
              <p className="mt-1 text-lg">Loading...</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">Loading...</p>
          </div>
        </div>
      </Card>
    </div>
  );
}