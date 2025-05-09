import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, MapPin, Calendar, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import JobsMap from './JobsMap';
import { Job, JobFilters } from '../../types/jobs';

type ViewMode = 'list' | 'map' | 'calendar';

export default function JobsList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});

  const handleExport = async () => {
    // Implement CSV export
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Jobs', path: '/jobs', active: true }
            ]}
          />
          <h1 className="mt-2">Jobs</h1>
        </div>

        <div className="flex gap-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                viewMode === 'map'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                viewMode === 'calendar'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
          </div>

          {selectedJobs.length > 0 && (
            <button
              onClick={handleExport}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Download size={16} />
              <span>Export Selected</span>
            </button>
          )}

          <button
            onClick={() => navigate('/jobs/new')}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Job</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button
              className="btn btn-secondary inline-flex items-center gap-2"
              onClick={() => {/* Open filter panel */}}
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
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
                  <th>Job Name</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Scheduled</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
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
                  <td>Roof Inspection</td>
                  <td>John Smith</td>
                  <td>123 Main St</td>
                  <td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Scheduled
                    </span>
                  </td>
                  <td>Mar 15, 2025</td>
                  <td>Tom Richards</td>
                  <td>
                    <button
                      onClick={() => navigate('/jobs/1')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}

        {viewMode === 'map' && (
          <JobsMap
            jobs={[]}
            onJobClick={(jobId) => navigate(`/jobs/${jobId}`)}
          />
        )}

        {viewMode === 'calendar' && (
          <div className="p-4">
            <p className="text-gray-500">Calendar view coming soon...</p>
          </div>
        )}
      </Card>
    </div>
  );
}