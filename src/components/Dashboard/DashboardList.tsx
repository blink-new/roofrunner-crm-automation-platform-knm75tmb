import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Plus, BarChart2, Copy, Trash2, Settings } from 'lucide-react';
import { Dashboard } from '../../types/dashboard';
import { DashboardService } from '../../lib/services/DashboardService';

interface DashboardListProps {
  onSelect: (dashboard: Dashboard) => void;
  onNew: () => void;
}

export default function DashboardList({ onSelect, onNew }: DashboardListProps) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getDashboards();
      setDashboards(data);
    } catch (error) {
      console.error('Error loading dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await DashboardService.cloneDashboard(id);
      loadDashboards();
    } catch (error) {
      console.error('Error cloning dashboard:', error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      try {
        await DashboardService.deleteDashboard(id);
        loadDashboards();
      } catch (error) {
        console.error('Error deleting dashboard:', error);
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Dashboards</h3>
          <button
            onClick={onNew}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Dashboard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 space-y-4 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : dashboards.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No dashboards found. Create your first dashboard to get started.
            </div>
          ) : (
            dashboards.map(dashboard => (
              <div
                key={dashboard.id}
                onClick={() => onSelect(dashboard)}
                className="border rounded-lg p-4 space-y-4 hover:border-primary-500 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={20} className="text-primary-500" />
                    <h4 className="font-medium">{dashboard.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleClone(dashboard.id, e)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Clone dashboard"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(dashboard.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete dashboard"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  {dashboard.description || 'No description'}
                </p>

                <div className="h-20 bg-gray-50 rounded-md flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    {dashboard.widgets.length} widgets
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Created: {new Date(dashboard.created_at).toLocaleDateString()}
                  </span>
                  {dashboard.isDefault && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}