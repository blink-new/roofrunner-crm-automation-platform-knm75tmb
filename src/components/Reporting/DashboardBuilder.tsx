import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Play, Plus, Trash2, ArrowUp, 
  ArrowDown, Settings, BarChart2, Layout
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Dashboard } from '../../types/dashboard';
import { DashboardService } from '../../lib/services/DashboardService';
import { LayoutService } from '../../lib/services/LayoutService';
import { PermissionService } from '../../lib/services/PermissionService';

export default function DashboardBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [dashboard, setDashboard] = useState<Dashboard>({
    id: id || crypto.randomUUID(),
    name: '',
    description: '',
    layout: [],
    permissions: {
      view: ['*'],
      edit: ['admin']
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '1'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadDashboard();
    }
  }, [id]);

  const loadDashboard = async () => {
    try {
      const dashboardData = await DashboardService.getDashboard(id!);
      setDashboard(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await DashboardService.updateDashboard(id!, {
          name: dashboard.name,
          description: dashboard.description,
          layout: dashboard.layout
        });
      } else {
        const newDashboard = await DashboardService.createDashboard({
          name: dashboard.name,
          description: dashboard.description,
          layout: dashboard.layout,
          permissions: dashboard.permissions
        });
        
        navigate(`/reporting/dashboards/${newDashboard.id}`);
      }
    } catch (error) {
      console.error('Error saving dashboard:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reporting', path: '/reporting' },
              { label: 'Dashboards', path: '/reporting/dashboards' },
              { 
                label: isEditing ? dashboard.name : 'New Dashboard', 
                path: isEditing ? `/reporting/dashboards/${id}` : `/reporting/dashboards/new`, 
                active: true 
              }
            ]}
          />
          <h1 className="mt-2">{isEditing ? dashboard.name : 'New Dashboard'}</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Dashboard'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Add Widgets</h2>
            <div className="space-y-4">
              <button className="w-full border border-dashed border-gray-300 rounded-md p-4 text-gray-500 hover:border-gray-400 flex flex-col items-center gap-2">
                <Layout size={24} />
                <span>Drag widgets here</span>
              </button>

              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-700">Available Reports</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-md hover:bg-gray-50">
                    Sales Performance
                  </button>
                  <button className="w-full text-left p-3 rounded-md hover:bg-gray-50">
                    Marketing Metrics
                  </button>
                  <button className="w-full text-left p-3 rounded-md hover:bg-gray-50">
                    Service Operations
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-9">
          <Card className="p-6 min-h-[600px]">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center">
              <div className="text-center">
                <Layout size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Drag and drop widgets to build your dashboard</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}