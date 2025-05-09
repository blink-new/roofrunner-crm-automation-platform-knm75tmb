import React from 'react';
import { Plus, Mail, MessageSquare } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';

export default function ReviewTemplates() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation' },
              { label: 'Templates', path: '/reputation/templates', active: true }
            ]}
          />
          <h1 className="mt-2">Review Templates</h1>
        </div>

        <button className="btn btn-primary inline-flex items-center gap-2">
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-primary-500" />
              <h3 className="font-medium">Standard Email Request</h3>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Edit
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Basic email template for review requests
          </p>
          <div className="text-sm text-gray-500">
            Last modified: 2 days ago
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-500" />
              <h3 className="font-medium">SMS Template</h3>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Edit
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Short message with review link
          </p>
          <div className="text-sm text-gray-500">
            Last modified: 5 days ago
          </div>
        </Card>

        <Card
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-6"
        >
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <h3 className="font-medium text-gray-900">Create Template</h3>
            <p className="text-sm text-gray-500 mt-1">
              Design a new review request template
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}