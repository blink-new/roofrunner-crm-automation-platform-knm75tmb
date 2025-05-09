import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, Download, BarChart2, FileText, Calendar, Phone, TrendingUp, Users } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Report } from '../../types/reporting';
import { ReportService } from '../../lib/services/ReportService';

export default function ReportList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await ReportService.getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        report.name.toLowerCase().includes(searchLower) ||
        (report.description || '').toLowerCase().includes(searchLower)
      );
    }
    
    if (activeTab === 'all') return true;
    return report.source === activeTab;
  });

  const handleExport = async (id: string, format: 'pdf' | 'csv') => {
    try {
      const downloadUrl = await ReportService.exportReport(id, format);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reporting', path: '/reporting', active: true }
            ]}
          />
          <h1 className="mt-2">Reports & Analytics</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/reporting/dashboards')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <BarChart2 size={16} />
            <span>Dashboards</span>
          </button>

          <button
            onClick={() => navigate('/reporting/new')}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Report</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'all'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Reports
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'appointments'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Appointment Reports
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'calls'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Call Reports
        </button>
        <button
          onClick={() => setActiveTab('attribution')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'attribution'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Attribution Reports
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'agent'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Agent Reports
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'custom'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Custom Reports
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="hover:shadow-md transition-shadow animate-pulse"
                >
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredReports.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery ? 'No reports found matching your search.' : 'No reports found. Create your first report to get started.'}
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {report.source === 'appointments' ? (
                        <Calendar size={20} className="text-blue-500" />
                      ) : report.source === 'calls' ? (
                        <Phone size={20} className="text-green-500" />
                      ) : report.source === 'attribution' ? (
                        <TrendingUp size={20} className="text-purple-500" />
                      ) : report.source === 'agent' ? (
                        <Users size={20} className="text-orange-500" />
                      ) : (
                        <FileText size={20} className="text-gray-500" />
                      )}
                      <h3 className="font-medium">{report.name}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created {new Date(report.created_at).toLocaleDateString()}</span>
                      {report.schedule && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{report.schedule.frequency}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/reporting/${report.id}`)}
                        className="btn btn-secondary text-sm flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleExport(report.id, 'pdf')}
                        className="btn btn-secondary text-sm p-2"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            <Card
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => navigate('/reporting/new')}
            >
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                  <Plus size={24} />
                </div>
                <h3 className="font-medium text-gray-900">Create New Report</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Build a custom report from scratch
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/reporting/appointments')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-medium">Appointment Report</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Track appointment scheduling, completion rates, and customer attendance
          </p>
          <button className="w-full btn btn-secondary text-sm">View Report</button>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/reporting/calls')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-medium">Call Report</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Analyze call volume, duration, and conversion metrics by agent
          </p>
          <button className="w-full btn btn-secondary text-sm">View Report</button>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/reporting/attribution')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-medium">Attribution Report</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Track lead sources, campaign performance, and marketing ROI
          </p>
          <button className="w-full btn btn-secondary text-sm">View Report</button>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/reporting/agent')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-medium">Agent Report</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Measure agent performance, productivity, and sales metrics
          </p>
          <button className="w-full btn btn-secondary text-sm">View Report</button>
        </Card>
      </div>
    </div>
  );
}