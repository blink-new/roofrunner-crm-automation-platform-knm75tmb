import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export default function JobDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Job Details</h1>
          <p className="text-gray-600">Job ID: {id}</p>
          {/* Additional job details will be implemented later */}
        </div>
      </Card>
    </div>
  );
}