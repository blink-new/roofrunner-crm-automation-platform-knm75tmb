import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export default function JobForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">
            {isEditing ? 'Edit Job' : 'Create New Job'}
          </h1>
          {/* Job form will be implemented later */}
        </div>
      </Card>
    </div>
  );
}