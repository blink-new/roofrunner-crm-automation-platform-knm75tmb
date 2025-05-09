import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit2, Download, Share2, Clock, Mail, ChevronLeft, 
  Calendar, Globe, Smartphone, Laptop, ArrowUp, ArrowDown
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Report } from '../../types/reporting';
import { ReportService } from '../../lib/services/ReportService';
import { ScheduleService } from '../../lib/services/ScheduleService';
import { PermissionService } from '../../lib/services/PermissionService';
import { ExportService } from '../../lib/services/ExportService';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [timeRange, setTimeRange] = useState('last_30_days');

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await ReportService.getReport(id!);
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const downloadUrl = await ReportService.exportReport(id!, format);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const handleSchedule = async (schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'csv';
  }) => {
    try {
      await ReportService.scheduleReport(id!, schedule);
      setShowScheduleModal(false);
      loadReport(); // Refresh to show updated schedule
    } catch (error) {
      console.error('Error scheduling report:', error);
    }
  };

  const handleShare = async (permissions: {
    view: string[];
    edit: string[];
  }) => {
    try {
      await PermissionService.updateReportPermissions(id!, permissions);
      setShowShareModal(false);
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleCreateShareLink = async () => {
    try {
      const { url } = await PermissionService.createShareLink(id!);
      navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error creating share link:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/reporting')}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        
        <Card className="p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/reporting')}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ChevronLeft size={20} />
          </button>
          <h1>Report Not Found</h1>
        </div>
        
        <Card className="p-6 text-center">
          <p className="text-gray-500">The requested report could not be found.</p>
          <button
            onClick={() => navigate('/reporting')}
            className="mt-4 btn btn-primary"
          >
            Back to Reports
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reporting', path: '/reporting' },
              { label: report.name, path: `/reporting/${id}`, active: true }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/reporting')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{report.name}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Clock size={16} />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => alert('Email functionality not implemented')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Mail size={16} />
            <span>Email</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate(`/reporting/${id}/edit`)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <Card className="p-6">
            {report.pages && report.pages.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{report.pages[currentPage]?.name || 'Page'}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm">
                      Page {currentPage + 1} of {report.pages.length}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(report.pages.length - 1, prev + 1))}
                      disabled={currentPage === report.pages.length - 1}
                      className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 min-h-[500px]">
                  {report.pages[currentPage]?.widgets?.length > 0 ? (
                    <div className="space-y-4">
                      {report.pages[currentPage].widgets.map((widget: any) => (
                        <div key={widget.id} className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{widget.title}</h3>
                          <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center">
                            <p className="text-gray-400">Widget preview</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No widgets on this page</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">This report has no pages.</p>
                <button
                  onClick={() => navigate(`/reporting/${id}/edit`)}
                  className="mt-4 btn btn-primary"
                >
                  Edit Report
                </button>
              </div>
            )}
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Report Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Source</label>
                <p className="mt-1 capitalize">{report.source}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Run</label>
                <p className="mt-1">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Schedule</label>
                <p className="mt-1">
                  {report.schedule ? `${report.schedule.frequency} at 9:00 AM` : 'Not scheduled'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm">{report.description || 'No description'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Filters</h3>
            {report.filters && report.filters.length > 0 ? (
              <div className="space-y-2">
                {report.filters.map((filter: any, index: number) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{filter.field}</span>
                      <span className="text-sm text-gray-500">{filter.operator}</span>
                    </div>
                    <p className="text-sm">{filter.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No filters applied</p>
            )}
            <button
              onClick={() => navigate(`/reporting/${id}/edit`)}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700"
            >
              Edit Filters
            </button>
          </Card>
        </div>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter email addresses"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple emails with commas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSchedule({
                    frequency: 'weekly',
                    recipients: ['user@example.com'],
                    format: 'pdf'
                  })}
                  className="btn btn-primary"
                >
                  Schedule
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Share Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share with Users
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter user emails"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple emails with commas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                </select>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreateShareLink}
                  className="w-full btn btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Link size={16} />
                  <span>Create Share Link</span>
                </button>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleShare({
                    view: ['user1', 'user2'],
                    edit: []
                  })}
                  className="btn btn-primary"
                >
                  Share
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}