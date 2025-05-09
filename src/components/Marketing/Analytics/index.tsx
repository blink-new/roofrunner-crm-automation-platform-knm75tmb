import React from 'react';
import { Card } from '../../ui/card';
import { BarChart, DollarSign, Users, TrendingUp, ArrowUp } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Marketing Analytics</h1>
        <p className="text-gray-600">Track and analyze your marketing campaign performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-2xl font-bold">2,543</h3>
          <p className="text-gray-600 text-sm">Total Subscribers</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BarChart size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              8%
            </span>
          </div>
          <h3 className="text-2xl font-bold">32.5%</h3>
          <p className="text-gray-600 text-sm">Average Open Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              15%
            </span>
          </div>
          <h3 className="text-2xl font-bold">24.8%</h3>
          <p className="text-gray-600 text-sm">Click-through Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ArrowUp size={16} className="mr-1" />
              24%
            </span>
          </div>
          <h3 className="text-2xl font-bold">$12.5k</h3>
          <p className="text-gray-600 text-sm">Revenue Generated</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Campaign performance chart will be implemented here</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audience Growth</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Audience growth chart will be implemented here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}