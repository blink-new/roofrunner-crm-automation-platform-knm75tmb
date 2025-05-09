import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Search, Plus, BarChart2, LineChart, PieChart, Table } from 'lucide-react';

interface WidgetOption {
  id: string;
  name: string;
  description: string;
  type: 'chart' | 'metric' | 'table' | 'embed';
  category: string;
  icon: React.ElementType;
}

interface WidgetPickerProps {
  onSelect: (widgetId: string) => void;
  onClose: () => void;
}

export default function WidgetPicker({ onSelect, onClose }: WidgetPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const widgets: WidgetOption[] = [
    {
      id: 'revenue-chart',
      name: 'Revenue Chart',
      description: 'Track revenue over time',
      type: 'chart',
      category: 'Sales',
      icon: BarChart2
    },
    {
      id: 'pipeline-funnel',
      name: 'Pipeline Funnel',
      description: 'View deal stages and conversion',
      type: 'chart',
      category: 'Sales',
      icon: PieChart
    },
    {
      id: 'lead-sources',
      name: 'Lead Sources',
      description: 'Analyze lead acquisition channels',
      type: 'chart',
      category: 'Marketing',
      icon: PieChart
    },
    {
      id: 'recent-tasks',
      name: 'Recent Tasks',
      description: 'View and manage recent tasks',
      type: 'table',
      category: 'Tasks',
      icon: Table
    }
  ];

  const categories = Array.from(new Set(widgets.map(w => w.category)));

  const filteredWidgets = widgets.filter(widget => {
    const matchesSearch = widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || widget.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add Widget</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search widgets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-48">
              <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    !selectedCategory ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  All Widgets
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedCategory === category ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {filteredWidgets.map(widget => (
                  <button
                    key={widget.id}
                    onClick={() => onSelect(widget.id)}
                    className="text-left p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-sm transition-all"
                  >
                    <widget.icon size={24} className="text-primary-500 mb-2" />
                    <h3 className="font-medium text-gray-900">{widget.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{widget.description}</p>
                  </button>
                ))}

                <button
                  onClick={() => onSelect('embed')}
                  className="text-left p-4 rounded-lg border border-dashed border-gray-300 hover:border-primary-500 hover:shadow-sm transition-all"
                >
                  <Plus size={24} className="text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Custom Embed</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Embed external content or create custom widget
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}