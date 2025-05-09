import React from 'react';
import { Users } from 'lucide-react';

export default function ContactsWidget() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
          <Users size={24} />
        </div>
        <div className="text-3xl font-bold text-gray-800">1,234</div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div className="bg-primary-500 h-2 rounded-full" style={{ width: '70%' }} />
      </div>
      <div className="text-sm text-green-600 font-medium">
        +12% vs last month
      </div>
    </div>
  );
}