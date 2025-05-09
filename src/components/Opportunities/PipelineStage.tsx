import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, Mail, Calendar, User } from 'lucide-react';
import { Card } from '../ui/card';
import { Deal } from '../../types/deals';

interface PipelineStageProps {
  deal: Deal;
  onClick: () => void;
}

export default function PipelineStage({ deal, onClick }: PipelineStageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    cursor: 'grab'
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 hover:shadow-md transition-shadow"
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{deal.name}</h4>
            <p className="text-sm text-gray-500 truncate">
              {deal.contact?.first_name} {deal.contact?.last_name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {deal.amount && (
              <span className="text-sm font-medium">
                ${deal.amount.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Apr 23rd</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Unassigned</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Phone size={14} className="text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Mail size={14} className="text-gray-500" />
          </button>
        </div>
      </div>
    </Card>
  );
}