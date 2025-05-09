import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, DollarSign, Calendar, User } from 'lucide-react';

export default function DealsList() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Deals</h1>
        <Button 
          onClick={() => navigate('/deals/new')}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <Table>
            <thead>
              <tr>
                <th className="font-semibold">Deal Name</th>
                <th className="font-semibold">Stage</th>
                <th className="font-semibold">Amount</th>
                <th className="font-semibold">Contact</th>
                <th className="font-semibold">Close Date</th>
                <th className="font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/deals/1')}>
                <td className="py-3">Website Redesign Project</td>
                <td>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Proposal
                  </span>
                </td>
                <td className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  5,000
                </td>
                <td className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  John Smith
                </td>
                <td className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Dec 31, 2025
                </td>
                <td>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}