import React from 'react';
import { DollarSign, TrendingUp, ChevronDown } from 'lucide-react';
import { Card } from '../ui/card';
import { ForecastSummary } from '../../types/deals';

interface ForecastWidgetProps {
  summary: ForecastSummary;
  onPeriodChange?: (period: string) => void;
}

export default function ForecastWidget({ summary, onPeriodChange }: ForecastWidgetProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Pipeline Forecast</h2>
        <button className="btn btn-secondary inline-flex items-center gap-2">
          <span>This Quarter</span>
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <DollarSign size={16} />
            <span className="text-sm">Total Pipeline</span>
          </div>
          <div className="text-2xl font-bold">
            ${(summary.total_value / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-gray-500">
            {summary.by_stage.reduce((acc, stage) => acc + stage.deal_count, 0)} deals
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp size={16} />
            <span className="text-sm">Weighted Pipeline</span>
          </div>
          <div className="text-2xl font-bold">
            ${(summary.weighted_value / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-gray-500">
            Based on probability
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <DollarSign size={16} />
            <span className="text-sm">Expected to Close</span>
          </div>
          <div className="text-2xl font-bold">
            ${(summary.by_stage.reduce((acc, stage) => {
              return acc + (stage.weighted_value * (stage.stage_name === 'Closing' ? 1 : 0));
            }, 0) / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-gray-500">
            This month
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">By Stage</h3>
        {summary.by_stage.map((stage) => (
          <div key={stage.stage_id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{stage.stage_name}</span>
              <span className="font-medium">
                ${(stage.weighted_value / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-primary-600">
                    {((stage.weighted_value / summary.weighted_value) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-100">
                <div
                  style={{ width: `${(stage.weighted_value / summary.weighted_value) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}