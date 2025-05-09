import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, FolderPlus } from 'lucide-react';
import Breadcrumbs from '../components/Navigation/Breadcrumbs';
import WorkflowList from '../components/Automation/WorkflowList';
import WorkflowBuilder from '../components/Automation/WorkflowBuilder';
import FolderManager from '../components/Automation/FolderManager';
import TemplateLibrary from '../components/Automation/TemplateLibrary';
import { Workflow, WorkflowTemplate } from '../types/automations';
import { WorkflowService } from '../lib/services/WorkflowService';
import { TemplateService } from '../lib/services/TemplateService';

export default function Automation() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadWorkflows();
  }, [selectedFolderId]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await WorkflowService.getWorkflows(selectedFolderId);
      setWorkflows(data);
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      const newWorkflow = await WorkflowService.createWorkflow({
        name: 'New Workflow',
        description: 'Workflow description',
        nodes: [],
        edges: [],
        active: false,
        user_id: 'current-user',
        folder_id: selectedFolderId,
        published: false
      });
      
      setWorkflows([newWorkflow, ...workflows]);
      setSelectedWorkflow(newWorkflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const handleSaveWorkflow = async (workflow: Workflow) => {
    try {
      await WorkflowService.updateWorkflow(workflow.id, workflow);
      setWorkflows(workflows.map(w => w.id === workflow.id ? workflow : w));
      setSelectedWorkflow(null);
      loadWorkflows(); // Refresh the list
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleBulkAction = async (action: 'enable' | 'disable' | 'clone' | 'delete', ids: string[]) => {
    try {
      switch (action) {
        case 'enable':
          await WorkflowService.bulkEnable(ids);
          break;
        case 'disable':
          await WorkflowService.bulkDisable(ids);
          break;
        case 'clone':
          for (const id of ids) {
            await WorkflowService.cloneWorkflow(id);
          }
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${ids.length} workflow(s)?`)) {
            await WorkflowService.bulkDelete(ids);
          } else {
            return;
          }
          break;
      }
      loadWorkflows();
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
    }
  };

  const handleApplyTemplate = async (template: WorkflowTemplate) => {
    try {
      const newWorkflow = await WorkflowService.createWorkflow({
        name: template.name,
        description: template.description,
        nodes: template.nodes,
        edges: template.edges,
        active: false,
        user_id: 'current-user',
        folder_id: selectedFolderId,
        published: false
      });
      
      setWorkflows([newWorkflow, ...workflows]);
      setSelectedWorkflow(newWorkflow);
      setShowTemplateLibrary(false);
    } catch (error) {
      console.error('Error applying template:', error);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    if (!searchQuery) return true;
    return (
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workflow.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Automation', path: '/automation', active: true }
            ]}
          />
          <h1 className="mt-2">Automation</h1>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search workflows..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Templates</span>
          </button>
          
          <button
            onClick={handleCreateWorkflow}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Workflow</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <FolderManager
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />
        </div>
        
        <div className="col-span-9">
          <WorkflowList
            onSelect={setSelectedWorkflow}
            onNew={handleCreateWorkflow}
            onBulkAction={handleBulkAction}
            workflows={filteredWorkflows}
            loading={loading}
          />
        </div>
      </div>

      {selectedWorkflow && (
        <WorkflowBuilder
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          onSave={handleSaveWorkflow}
        />
      )}

      {showTemplateLibrary && (
        <TemplateLibrary
          onApplyTemplate={handleApplyTemplate}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
    </div>
  );
}