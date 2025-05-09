import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Save, X } from 'lucide-react';
import { WidgetType } from '../../types/dashboard';

interface WidgetConfigModalProps {
  widget: WidgetType;
  onClose: () => void;
  onSave: (config: Partial<WidgetType>) => void;
}

export default function WidgetConfigModal({
  widget,
  onClose,
  onSave
}: WidgetConfigModalProps) {
  const [config, setConfig] = useState({
    title: widget.title || '',
    dateRange: widget.dateRange || 'last_30_days',
    chartType: widget.chartType || 'bar',
    filters: widget.filters || {},
    target: widget.target || null,
    conditionalFormatting: widget.conditionalFormatting || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Configure Widget</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="Enter widget title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={config.dateRange}
                onChange={(e) => setConfig({ ...config, dateRange: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="this_quarter">This quarter</option>
                <option value="last_quarter">Last quarter</option>
                <option value="this_year">This year</option>
                <option value="last_year">Last year</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                value={config.chartType}
                onChange={(e) => setConfig({ ...config, chartType: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="donut">Donut Chart</option>
                <option value="area">Area Chart</option>
                <option value="table">Table</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Value
              </label>
              <input
                type="number"
                value={config.target || ''}
                onChange={(e) => setConfig({ ...config, target: Number(e.target.value) })}
                className="w-full rounded-md border-gray-300"
                placeholder="Enter target value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditional Formatting
              </label>
              <div className="space-y-2">
                {config.conditionalFormatting.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={rule.operator}
                      onChange={(e) => {
                        const newFormatting = [...config.conditionalFormatting];
                        newFormatting[index] = {
                          ...rule,
                          operator: e.target.value
                        };
                        setConfig({ ...config, conditionalFormatting: newFormatting });
                      }}
                      className="rounded-md border-gray-300"
                    >
                      <option value="greater_than">Greater than</option>
                      <option value="less_than">Less than</option>
                      <option value="equal">Equal to</option>
                    </select>
                    <input
                      type="number"
                      value={rule.value}
                      onChange={(e) => {
                        const newFormatting = [...config.conditionalFormatting];
                        newFormatting[index] = {
                          ...rule,
                          value: Number(e.target.value)
                        };
                        setConfig({ ...config, conditionalFormatting: newFormatting });
                      }}
                      className="w-24 rounded-md border-gray-300"
                    />
                    <input
                      type="color"
                      value={rule.color}
                      onChange={(e) => {
                        const newFormatting = [...config.conditionalFormatting];
                        newFormatting[index] = {
                          ...rule,
                          color: e.target.value
                        };
                        setConfig({ ...config, conditionalFormatting: newFormatting });
                      }}
                      className="w-12 h-8 rounded-md border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFormatting = config.conditionalFormatting.filter((_, i) => i !== index);
                        setConfig({ ...config, conditionalFormatting: newFormatting });
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setConfig({
                      ...config,
                      conditionalFormatting: [
                        ...config.conditionalFormatting,
                        { operator: 'greater_than', value: 0, color: '#00ff00' }
                      ]
                    });
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Add formatting rule
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}