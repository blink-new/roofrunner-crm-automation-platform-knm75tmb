import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { WidgetType } from '../../types/dashboard';
import ContactsWidget from './Widgets/ContactsWidget';
import OpportunitiesWidget from './Widgets/OpportunitiesWidget';
import PipelineWidget from './Widgets/PipelineWidget';
import RevenueWidget from './Widgets/RevenueWidget';
import EventsWidget from './Widgets/EventsWidget';
import ConversationsWidget from './Widgets/ConversationsWidget';
import TasksWidget from './Widgets/TasksWidget';
import JobsWidget from './Widgets/JobsWidget';

interface DashboardWidgetProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
}

const widgetComponents = {
  contacts: ContactsWidget,
  opportunities: OpportunitiesWidget,
  pipeline: PipelineWidget,
  revenue: RevenueWidget,
  events: EventsWidget,
  conversations: ConversationsWidget,
  tasks: TasksWidget,
  jobs: JobsWidget,
};

export default function DashboardWidget({ widget, onRemove }: DashboardWidgetProps) {
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

  const WidgetComponent = widgetComponents[widget.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        widget.size === 'large' ? 'lg:col-span-2' : ''
      }`}
    >
      <Card className="h-full">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="cursor-move p-1 hover:bg-gray-100 rounded text-gray-400"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </button>
            <h2 className="text-base font-medium text-gray-700">
              {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1 hover:bg-gray-100 rounded text-gray-400"
              onClick={() => {/* Open settings */}}
            >
              <Settings size={16} />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded text-gray-400"
              onClick={() => onRemove(widget.id)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <WidgetComponent />
        </div>
      </Card>
    </div>
  );
}