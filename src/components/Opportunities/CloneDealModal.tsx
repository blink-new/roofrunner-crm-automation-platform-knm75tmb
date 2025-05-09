import React, { useState } from 'react';
import { X, Copy, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Deal } from '../../types/deals';

interface CloneDealModalProps {
  deal: Deal;
  onClose: () => void;
  onClone: (deal: Deal) => Promise<void>;
}

export default function CloneDealModal({ deal, onClose, onClone }: CloneDealModalProps) {
  const [clonedDeal, setClonedDeal] = useState<Partial<Deal>>({
    ...deal,
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
    status: 'open',
    name: `${deal.name} (Copy)`,
    expected_close_date: undefined
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleClone = async () => {
    try {
      setIsSaving(true);
      await onClone(clonedDeal as Deal);
      onClose();
    } catch (error) {
      console.error('Error cloning deal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Clone Deal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Name
            </label>
            <input
              type="text"
              value={clonedDeal.name}
              onChange={(e) => setClonedDeal({ ...clonedDeal, name: e.target.value })}
              className="w-full rounded-md border-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pipeline
              </label>
              <select
                value={clonedDeal.pipeline_id}
                onChange={(e) => setClonedDeal({ ...clonedDeal, pipeline_id: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value={deal.pipeline_id}>Current Pipeline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                value={clonedDeal.stage_id}
                onChange={(e) => setClonedDeal({ ...clonedDeal, stage_id: e.target.value })}
                className="w-full rounded-md border-gray-300"
              >
                <option value={deal.stage_id}>Current Stage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={clonedDeal.amount}
                  onChange={(e) => setClonedDeal({ ...clonedDeal, amount: Number(e.target.value) })}
                  className="w-full pl-8 rounded-md border-gray-300"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Close Date
              </label>
              <input
                type="date"
                onChange={(e) => setClonedDeal({ ...clonedDeal, expected_close_date: e.target.value })}
                className="w-full rounded-md border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clone Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600"
                  checked={true}
                  onChange={() => {}}
                />
                <span className="ml-2 text-sm text-gray-700">Clone custom fields</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600"
                  checked={true}
                  onChange={() => {}}
                />
                <span className="ml-2 text-sm text-gray-700">Clone tags</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleClone}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Cloning...</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Clone Deal</span>
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}