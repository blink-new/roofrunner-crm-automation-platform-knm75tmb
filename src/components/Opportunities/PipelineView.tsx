import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '../ui/card';
import { Deal } from '../../types/deals';
import PipelineStage from './PipelineStage';

interface PipelineViewProps {
  stages: {
    id: string;
    name: string;
    deals: Deal[];
    total: number;
  }[];
  onDragEnd: (event: DragEndEvent) => void;
  onDealClick: (dealId: string) => void;
}

export default function PipelineView({ stages, onDragEnd, onDealClick }: PipelineViewProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  return (
    <div className="h-full overflow-x-auto">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 p-4 min-w-fit h-full">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="w-80 flex-shrink-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{stage.name}</h3>
                  <p className="text-sm text-gray-500">
                    {stage.deals.length} opportunities • ${stage.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <SortableContext
                items={stage.deals.map(deal => deal.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="space-y-2">
                  {stage.deals.map((deal) => (
                    <PipelineStage
                      key={deal.id}
                      deal={deal}
                      onClick={() => onDealClick(deal.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}