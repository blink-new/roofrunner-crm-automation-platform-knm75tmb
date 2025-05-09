import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, User, Phone, Mail, Edit2 } from 'lucide-react';

export default function DealDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Website Redesign Project</h1>
        <Button variant="outline">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Deal
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Deal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                5,000
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Stage</p>
              <p className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm w-fit">
                Proposal
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Close Date</p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Dec 31, 2025
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Status</p>
              <p className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm w-fit">
                Active
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>John Smith</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>john@example.com</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}