import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Table } from '@/components/ui/table';

interface ListViewProps {
  searchQuery: string;
  selectedOpportunities: string[];
  onSelectOpportunities: (ids: string[]) => void;
}

export default function ListView({
  searchQuery,
  selectedOpportunities,
  onSelectOpportunities
}: ListViewProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th className="w-12">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={false}
                onChange={() => {}}
              />
            </th>
            <th>Opportunity</th>
            <th>Contact</th>
            <th>Stage</th>
            <th>Amount</th>
            <th>Close Date</th>
            <th>Owner</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50 cursor-pointer">
            <td className="px-4 py-3">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={false}
                onChange={() => {}}
              />
            </td>
            <td>Website Redesign</td>
            <td>John Smith</td>
            <td>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            </td>
            <td>$5,000</td>
            <td>Dec 31, 2025</td>
            <td>Tom Richards</td>
            <td>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal size={16} />
              </button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}