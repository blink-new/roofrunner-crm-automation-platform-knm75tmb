import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { WidgetType } from '../../types/dashboard';
import WidgetContainer from './WidgetContainer';

interface LayoutManagerProps {
  widgets: WidgetType[];
  onWidgetRemove: (id: string) => void;
  onWidgetDuplicate: (id: string) => void;
  onWidgetConfigure: (id: string) => void;
  onLayoutChange: (layout: Array<{ id: string; x: number; y: number; w: number; h: number }>) => void;
}

interface SortableWidgetProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onConfigure: (id: string) => void;
}

function SortableWidget({ widget, onRemove, onDuplicate, onConfigure }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        widget.size === 'large' ? 'col-span-2' : widget.size === 'medium' ? 'col-span-1' : 'col-span-1'
      }`}
    >
      <div className="h-full">
        <div className="cursor-move absolute top-4 left-4 p-1 hover:bg-gray-100 rounded text-gray-400 z-10" {...attributes} {...listeners}>
          <GripVertical size={16} />
        </div>
        <WidgetContainer
          widget={widget}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          onConfigure={onConfigure}
        />
      </div>
    </div>
  );
}

export default function LayoutManager({
  widgets,
  onWidgetRemove,
  onWidgetDuplicate,
  onWidgetConfigure,
  onLayoutChange
}: LayoutManagerProps) {
  // This would be expanded with actual grid layout functionality
  // For now, we're just rendering the widgets in a grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget) => (
        <SortableWidget
          key={widget.id}
          widget={widget}
          onRemove={onWidgetRemove}
          onDuplicate={onWidgetDuplicate}
          onConfigure={onWidgetConfigure}
        />
      ))}
    </div>
  );
}