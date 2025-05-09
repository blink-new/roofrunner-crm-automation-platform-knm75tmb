import React, { useState, useEffect } from 'react';
import { X, Save, Play, Plus, Zap, History, BarChart2, FolderPlus, Maximize, Minimize } from 'lucide-react';
import { Card } from '../ui/card';
import { Workflow, Node, Edge } from '../../types/automations';
import NodePalette from './NodePalette';
import Canvas from './WorkflowCanvas';
import TriggerConfigPanel from './TriggerConfigPanel';
import ActionConfigPanel from './ActionConfigPanel';
import VersionHistoryPanel from './VersionHistoryPanel';
import StatsView from './StatsView';
import TestRunModal from './TestRunModal';
import { WorkflowService } from '../../lib/services/WorkflowService';
import { VersionService } from '../../lib/services/VersionService';

interface WorkflowBuilderProps {
  workflow: Workflow;
  onClose: () => void;
  onSave: (workflow: Workflow) => Promise<void>;
}

export default function WorkflowBuilder({ workflow, onClose, onSave }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isPublished, setIsPublished] = useState(workflow.published || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleAddNode = (type: Node['type']) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position: { x: 100, y: 100 },
      data: {
        name: `New ${type}`,
        description: `${type} node`
      }
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
  };

  const handleUpdateNode = (nodeId: string, data: Record<string, any>) => {
    setNodes(nodes.map(node =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    ));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedWorkflow = {
        ...workflow,
        nodes,
        edges,
        published: isPublished
      };
      await onSave(updatedWorkflow);
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsSaving(true);
      await WorkflowService.publish(workflow.id, !isPublished);
      setIsPublished(!isPublished);
    } catch (error) {
      console.error('Error publishing workflow:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (version: number) => {
    try {
      const versionData = await VersionService.rollback(workflow.id, version);
      setNodes(versionData.nodes);
      setEdges(versionData.edges);
      setShowVersionHistory(false);
    } catch (error) {
      console.error('Error rolling back version:', error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-white z-50 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-semibold">{workflow.name}</h2>
          <p className="text-sm text-gray-500">{workflow.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => setIsPublished(false)}
              className={`px-3 py-1.5 text-sm ${
                !isPublished
                  ? 'bg-primary-50 text-primary-700'
                  : 'bg-white text-gray-700'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setIsPublished(true)}
              className={`px-3 py-1.5 text-sm ${
                isPublished
                  ? 'bg-primary-50 text-primary-700'
                  : 'bg-white text-gray-700'
              }`}
            >
              Published
            </button>
          </div>

          <button
            onClick={() => setShowTestModal(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Play size={16} />
            <span>Test</span>
          </button>

          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r border-gray-200 p-4 flex flex-col">
          <NodePalette onAddNode={handleAddNode} />
        </div>

        <div className="flex-1 relative">
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodeSelect={handleNodeSelect}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
          />
        </div>

        {selectedNode && (
          <div className="w-80 border-l border-gray-200 overflow-y-auto">
            {selectedNode.type === 'trigger' ? (
              <TriggerConfigPanel
                workflowId={workflow.id}
                node={selectedNode}
                onUpdate={handleUpdateNode}
                onClose={() => setSelectedNode(null)}
              />
            ) : (
              <ActionConfigPanel
                workflowId={workflow.id}
                node={selectedNode}
                onUpdate={handleUpdateNode}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>
        )}

        {showStats && (
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium">Workflow Stats</h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <StatsView workflowId={workflow.id} />
            </div>
          </div>
        )}

        {showVersionHistory && (
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <VersionHistoryPanel
              workflowId={workflow.id}
              currentVersion={workflow.version}
              onRollback={handleRollback}
              onClose={() => setShowVersionHistory(false)}
            />
          </div>
        )}
      </div>

      <div className="h-12 border-t border-gray-200 flex items-center px-6">
        <div className="flex-1">
          <div className="text-sm text-gray-500">
            Last edited: {new Date(workflow.updated_at).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowVersionHistory(true)}
            className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
          >
            <History size={16} />
            <span>Version History</span>
          </button>
          <button
            onClick={() => setShowStats(true)}
            className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
          >
            <BarChart2 size={16} />
            <span>Stats</span>
          </button>
        </div>
      </div>

      {showTestModal && (
        <TestRunModal
          workflowId={workflow.id}
          onClose={() => setShowTestModal(false)}
        />
      )}
    </div>
  );
}