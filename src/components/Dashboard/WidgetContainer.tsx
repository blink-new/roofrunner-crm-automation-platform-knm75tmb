import React, { useState } from 'react';
import { Card } from '../ui/card';
import { MoreHorizontal, Maximize2, Copy, Trash2 } from 'lucide-react';
import { WidgetType } from '../../types/dashboard';

interface WidgetContainerProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onConfigure: (id: string) => void;
}

export default function WidgetContainer({
  widget,
  onRemove,
  onDuplicate,
  onConfigure
}: WidgetContainerProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-700">
          {widget.title || widget.type}
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded text-gray-400"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onConfigure(widget.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Maximize2 size={16} />
                <span>Configure</span>
              </button>
              <button
                onClick={() => {
                  onDuplicate(widget.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy size={16} />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => {
                  onRemove(widget.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {/* Widget content will be rendered here */}
        <div className="h-64 flex items-center justify-center text-gray-500">
          Widget content
        </div>
      </div>
    </Card>
  );
}