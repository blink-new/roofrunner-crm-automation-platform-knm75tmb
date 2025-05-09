import React from 'react';
import { Card } from '@/components/ui/card';

export default function InvoiceDetail() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice Details</h1>
        <p className="text-sm text-gray-500">View invoice details</p>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">Invoice details coming soon</p>
      </Card>
    </div>
  );
}