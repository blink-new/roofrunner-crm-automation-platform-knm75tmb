import React from 'react';
import { Node, Edge } from '../../types/automations';

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (node: Node) => void;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

export default function Canvas({
  nodes,
  edges,
  onNodeSelect,
  onNodesChange,
  onEdgesChange
}: CanvasProps) {
  return (
    <div className="w-full h-full bg-gray-50 overflow-hidden">
      {/* Canvas implementation will be added later */}
      <div className="p-4">
        <p className="text-gray-500">Drag nodes from the palette to start building your workflow</p>
      </div>
    </div>
  );
}