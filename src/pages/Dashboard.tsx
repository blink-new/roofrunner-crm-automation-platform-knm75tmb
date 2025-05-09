import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Share2, Copy, Settings } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import Breadcrumbs from '../components/Navigation/Breadcrumbs';
import LayoutManager from '../components/Dashboard/LayoutManager';
import WidgetPicker from '../components/Dashboard/WidgetPicker';
import WidgetConfigModal from '../components/Dashboard/WidgetConfigModal';
import EmbedWidget from '../components/Dashboard/EmbedWidget';
import ShareDashboardModal from '../components/Dashboard/ShareDashboardModal';
import WebhookSettings from '../components/Dashboard/WebhookSettings';
import { WidgetType, Dashboard as DashboardType } from '../types/dashboard';
import { DashboardService } from '../lib/services/DashboardService';
import { WidgetService } from '../lib/services/WidgetService';
import { LayoutService } from '../lib/services/LayoutService';
import { PermissionService } from '../lib/services/PermissionService';

const defaultWidgets: WidgetType[] = [
  { id: 'contacts', type: 'contacts', size: 'small', title: 'Contacts' },
  { id: 'opportunities', type: 'opportunities', size: 'medium', title: 'Opportunities' },
  { id: 'pipeline', type: 'pipeline', size: 'large', title: 'Pipeline' },
  { id: 'revenue', type: 'revenue', size: 'medium', title: 'Revenue' },
  { id: 'events', type: 'events', size: 'medium', title: 'Events' },
  { id: 'conversations', type: 'conversations', size: 'small', title: 'Conversations' },
  { id: 'tasks', type: 'tasks', size: 'medium', title: 'Tasks' },
  { id: 'jobs', type: 'jobs', size: 'small', title: 'Jobs' }
];

export default function Dashboard() {
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWebhookSettings, setShowWebhookSettings] = useState(false);
  const [configWidget, setConfigWidget] = useState<WidgetType | null>(null);
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);

  useEffect(() => {
    // In a real app, we would load the dashboard from the API
    // For now, we'll just use the default widgets
    setDashboard({
      id: '1',
      name: 'Main Dashboard',
      widgets: defaultWidgets,
      layout: defaultWidgets.map((widget, index) => ({
        id: widget.id,
        x: index % 4,
        y: Math.floor(index / 4),
        w: widget.size === 'large' ? 2 : 1,
        h: 1
      })),
      permissions: {
        view: ['*'],
        edit: ['user1']
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'user1'
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleAddWidget = (widgetId: string) => {
    if (widgetId === 'embed') {
      setShowWidgetPicker(false);
      setShowEmbedModal(true);
      return;
    }

    // In a real app, we would fetch the widget from the API
    // For now, we'll just add a new widget with a random ID
    const newWidget: WidgetType = {
      id: crypto.randomUUID(),
      type: 'revenue',
      size: 'medium',
      title: 'New Widget'
    };

    setWidgets([...widgets, newWidget]);
    setShowWidgetPicker(false);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const handleDuplicateWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;

    const newWidget: WidgetType = {
      ...widget,
      id: crypto.randomUUID(),
      title: `${widget.title} (Copy)`
    };

    setWidgets([...widgets, newWidget]);
  };

  const handleConfigureWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      setConfigWidget(widget);
    }
  };

  const handleSaveWidgetConfig = (config: Partial<WidgetType>) => {
    if (!configWidget) return;

    setWidgets(widgets.map(w =>
      w.id === configWidget.id ? { ...w, ...config } : w
    ));
  };

  const handleSaveEmbedWidget = (config: { url: string; width: number; height: number }) => {
    const newWidget: WidgetType = {
      id: crypto.randomUUID(),
      type: 'embed',
      size: 'medium',
      title: 'Embedded Content',
      embedUrl: config.url,
      embedWidth: config.width,
      embedHeight: config.height
    };

    setWidgets([...widgets, newWidget]);
    setShowEmbedModal(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleLayoutChange = (layout: Array<{ id: string; x: number; y: number; w: number; h: number }>) => {
    if (!dashboard) return;

    setDashboard({
      ...dashboard,
      layout
    });
  };

  const handleShareDashboard = async (permissions: { view: string[]; edit: string[] }) => {
    if (!dashboard) return;

    try {
      await PermissionService.updateDashboardPermissions(dashboard.id, permissions);
      setDashboard({
        ...dashboard,
        permissions
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleCloneDashboard = async () => {
    if (!dashboard) return;

    try {
      await DashboardService.cloneDashboard(dashboard.id);
      // In a real app, we would redirect to the new dashboard
      alert('Dashboard cloned successfully');
    } catch (error) {
      console.error('Error cloning dashboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs 
            items={[
              { label: 'Home', path: '/' }, 
              { label: 'Dashboard', path: '/', active: true }
            ]} 
          />
          <h1 className="mt-2">Dashboard</h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            className={`btn btn-secondary inline-flex items-center gap-2 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          <button
            onClick={handleCloneDashboard}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Copy size={16} />
            <span>Clone</span>
          </button>

          <button
            onClick={() => setShowWebhookSettings(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Settings size={16} />
            <span>Webhooks</span>
          </button>

          <button 
            onClick={() => setShowWidgetPicker(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Widget</span>
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map(w => w.id)}>
          <LayoutManager
            widgets={widgets}
            onWidgetRemove={handleRemoveWidget}
            onWidgetDuplicate={handleDuplicateWidget}
            onWidgetConfigure={handleConfigureWidget}
            onLayoutChange={handleLayoutChange}
          />
        </SortableContext>
      </DndContext>

      {showWidgetPicker && (
        <WidgetPicker
          onSelect={handleAddWidget}
          onClose={() => setShowWidgetPicker(false)}
        />
      )}

      {showEmbedModal && (
        <EmbedWidget
          onClose={() => setShowEmbedModal(false)}
          onSave={handleSaveEmbedWidget}
        />
      )}

      {configWidget && (
        <WidgetConfigModal
          widget={configWidget}
          onClose={() => setConfigWidget(null)}
          onSave={handleSaveWidgetConfig}
        />
      )}

      {showShareModal && dashboard && (
        <ShareDashboardModal
          dashboardId={dashboard.id}
          dashboardName={dashboard.name}
          permissions={dashboard.permissions}
          onClose={() => setShowShareModal(false)}
          onSave={handleShareDashboard}
        />
      )}

      {showWebhookSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Webhook Settings</h2>
              <button
                onClick={() => setShowWebhookSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <WebhookSettings />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}