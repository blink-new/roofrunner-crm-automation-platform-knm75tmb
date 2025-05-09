import React from 'react';
import { Card } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice Settings</h1>
        <p className="text-sm text-gray-500">Configure your invoice settings</p>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">Settings coming soon</p>
      </Card>
    </div>
  );
}