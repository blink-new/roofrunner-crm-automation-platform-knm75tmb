import React from 'react';
import { Card } from '../../ui/card';

export default function TemplateLibrary() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Email Templates</h1>
        <p className="text-gray-600">Manage and create email templates for your marketing campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template Cards */}
        <Card className="hover:shadow-lg transition-shadow">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Welcome Series</h3>
            <p className="text-sm text-gray-600 mt-1">Onboarding email sequence for new contacts</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Last edited: 2 days ago</span>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Monthly Newsletter</h3>
            <p className="text-sm text-gray-600 mt-1">Regular updates and company news</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Last edited: 5 days ago</span>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Promotional</h3>
            <p className="text-sm text-gray-600 mt-1">Special offers and seasonal promotions</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Last edited: 1 week ago</span>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </Card>

        {/* Add New Template Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <button className="w-full h-full p-4 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">Create New Template</span>
            </div>
          </button>
        </Card>
      </div>
    </div>
  );
}