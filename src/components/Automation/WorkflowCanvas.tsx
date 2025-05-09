import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Minimize, Grid3X3 } from 'lucide-react';
import { Node, Edge } from '../../types/automations';

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (node: Node) => void;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onLayoutChange?: (layout: { zoom: number; position: { x: number; y: number } }) => void;
}

export default function WorkflowCanvas({
  nodes,
  edges,
  onNodeSelect,
  onNodesChange,
  onEdgesChange,
  onLayoutChange
}: WorkflowCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onLayoutChange) {
      onLayoutChange({ zoom, position });
    }
  }, [zoom, position, onLayoutChange]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleFitToScreen = () => {
    if (!nodes.length) return;
    
    // Calculate bounds
    const bounds = nodes.reduce(
      (acc, node) => {
        acc.minX = Math.min(acc.minX, node.position.x);
        acc.maxX = Math.max(acc.maxX, node.position.x + 200); // Assuming node width
        acc.minY = Math.min(acc.minY, node.position.y);
        acc.maxY = Math.max(acc.maxY, node.position.y + 100); // Assuming node height
        return acc;
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
    
    if (canvasRef.current) {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      const contentWidth = bounds.maxX - bounds.minX + 100; // Add padding
      const contentHeight = bounds.maxY - bounds.minY + 100; // Add padding
      
      const newZoom = Math.min(
        width / contentWidth,
        height / contentHeight,
        1 // Cap at 1x zoom
      );
      
      setZoom(newZoom);
      setPosition({
        x: (width / 2) - ((bounds.minX + bounds.maxX) / 2) * newZoom,
        y: (height / 2) - ((bounds.minY + bounds.maxY) / 2) * newZoom
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0 && e.altKey) { // Middle mouse button or Alt+Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.max(0.5, Math.min(prev + delta, 2)));
    }
  };

  // This is a placeholder for the actual canvas implementation
  // In a real app, you would use a library like react-flow or a custom canvas implementation
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
          title="Fit to Screen"
        >
          <Maximize size={16} />
        </button>
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
          title={showMinimap ? "Hide Minimap" : "Show Minimap"}
        >
          <Grid3X3 size={16} />
        </button>
      </div>

      {showMinimap && (
        <div className="absolute bottom-4 right-4 w-48 h-32 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden z-10">
          <div className="relative w-full h-full">
            {/* Minimap content */}
            <div className="absolute inset-2">
              {nodes.map(node => (
                <div
                  key={node.id}
                  className="absolute w-3 h-3 bg-primary-500 rounded-sm"
                  style={{
                    left: `${(node.position.x / 2000) * 100}%`,
                    top: `${(node.position.y / 2000) * 100}%`
                  }}
                />
              ))}
            </div>
            {/* Viewport indicator */}
            <div
              className="absolute border-2 border-primary-500 rounded-sm pointer-events-none"
              style={{
                left: `${(-position.x / zoom / 20)}%`,
                top: `${(-position.y / zoom / 20)}%`,
                width: `${(canvasRef.current?.clientWidth || 0) / zoom / 20}%`,
                height: `${(canvasRef.current?.clientHeight || 0) / zoom / 20}%`
              }}
            />
          </div>
        </div>
      )}

      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '2000px',
            height: '2000px'
          }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 bg-grid-pattern" />

          {/* Edges */}
          <svg className="absolute inset-0 pointer-events-none">
            {edges.map(edge => {
              const source = nodes.find(n => n.id === edge.source);
              const target = nodes.find(n => n.id === edge.target);
              
              if (!source || !target) return null;
              
              const sourceX = source.position.x + 100; // Assuming node width is 200
              const sourceY = source.position.y + 50; // Assuming node height is 100
              const targetX = target.position.x;
              const targetY = target.position.y + 50;
              
              return (
                <g key={edge.id}>
                  <path
                    d={`M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`}
                    stroke={edge.type === 'success' ? '#10B981' : edge.type === 'failure' ? '#EF4444' : '#94A3B8'}
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Arrow head */}
                  <polygon
                    points={`${targetX},${targetY} ${targetX - 10},${targetY - 5} ${targetX - 10},${targetY + 5}`}
                    fill={edge.type === 'success' ? '#10B981' : edge.type === 'failure' ? '#EF4444' : '#94A3B8'}
                  />
                  {/* Edge label */}
                  {edge.label && (
                    <text
                      x={(sourceX + targetX) / 2}
                      y={((sourceY + targetY) / 2) - 10}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="12"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const nodeColors = {
              trigger: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
              condition: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
              action: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
              delay: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
              goal: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' }
            };
            
            const colors = nodeColors[node.type] || nodeColors.action;
            
            return (
              <div
                key={node.id}
                className={`absolute w-48 rounded-lg border-2 ${colors.border} ${colors.bg} shadow-sm cursor-pointer`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`
                }}
                onClick={() => onNodeSelect(node)}
              >
                <div className={`p-3 ${colors.text}`}>
                  <div className="font-medium">{node.data.name || node.type}</div>
                  <div className="text-sm opacity-75">
                    {node.data.description || `${node.type} node`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}