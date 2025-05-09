import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Check, Plus } from 'lucide-react';
import { DashboardLayout } from '../../types/dashboard';
import { LayoutService } from '../../lib/services/LayoutService';

interface LayoutSelectorProps {
  selectedLayout: string;
  onSelect: (layoutId: string) => void;
  onNew: () => void;
}

export default function LayoutSelector({
  selectedLayout,
  onSelect,
  onNew
}: LayoutSelectorProps) {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      setLoading(true);
      const data = await LayoutService.getLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Error loading layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Dashboard Layouts</h3>
          <button
            onClick={onNew}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Layout</span>
          </button>
        </div>

        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : layouts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No layouts found. Create your first layout to get started.
            </div>
          ) : (
            layouts.map(layout => (
              <button
                key={layout.id}
                onClick={() => onSelect(layout.id)}
                className={`w-full text-left p-4 rounded-lg border ${
                  selectedLayout === layout.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{layout.name}</h4>
                    <p className="text-sm text-gray-500">
                      {layout.widgets.length} widgets
                    </p>
                  </div>
                  {selectedLayout === layout.id && (
                    <Check size={20} className="text-primary-500" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}