import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Deal, DealDuplicate } from '../../types/deals';

interface DuplicateDetectionProps {
  deal: Deal;
  duplicate: Deal;
  duplicateInfo: DealDuplicate;
  onClose: () => void;
  onMerge: (sourceDeal: Deal, targetDeal: Deal, fieldSelections: Record<string, string>) => Promise<void>;
}

export default function DuplicateDetection({
  deal,
  duplicate,
  duplicateInfo,
  onClose,
  onMerge
}: DuplicateDetectionProps) {
  const [selectedFields, setSelectedFields] = useState<Record<string, string>>({});
  const [isMerging, setIsMerging] = useState(false);

  const handleMerge = async () => {
    try {
      setIsMerging(true);
      await onMerge(deal, duplicate, selectedFields);
      onClose();
    } catch (error) {
      console.error('Error merging deals:', error);
    } finally {
      setIsMerging(false);
    }
  };

  const compareFields = [
    { key: 'name', label: 'Deal Name' },
    { key: 'amount', label: 'Amount' },
    { key: 'expected_close_date', label: 'Close Date' },
    { key: 'probability', label: 'Probability' },
    { key: 'stage_id', label: 'Stage' },
    { key: 'contact_id', label: 'Contact' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-warning-600">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-semibold">Potential Duplicate Deal</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Match score:</span>
              <span className="font-medium text-warning-600">{duplicateInfo.score}%</span>
            </div>
            <div className="text-sm text-gray-500">
              Reasons:
              <ul className="list-disc list-inside mt-1">
                {duplicateInfo.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Current Deal</h3>
              <div className="space-y-4">
                {compareFields.map((field) => (
                  <div key={field.key} className="flex items-start gap-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                    </div>
                    <div className="w-2/3">
                      <div
                        className={`p-2 rounded ${
                          selectedFields[field.key] === 'current'
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <button
                          className="w-full text-left text-sm"
                          onClick={() => setSelectedFields({
                            ...selectedFields,
                            [field.key]: 'current'
                          })}
                        >
                          {deal[field.key] || <em className="text-gray-400">Empty</em>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Duplicate Deal</h3>
              <div className="space-y-4">
                {compareFields.map((field) => (
                  <div key={field.key} className="flex items-start gap-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                    </div>
                    <div className="w-2/3">
                      <div
                        className={`p-2 rounded ${
                          selectedFields[field.key] === 'duplicate'
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <button
                          className="w-full text-left text-sm"
                          onClick={() => setSelectedFields({
                            ...selectedFields,
                            [field.key]: 'duplicate'
                          })}
                        >
                          {duplicate[field.key] || <em className="text-gray-400">Empty</em>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isMerging}
          >
            Keep Both
          </button>
          <button
            onClick={handleMerge}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isMerging || Object.keys(selectedFields).length === 0}
          >
            {isMerging ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Merging...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Merge Deals</span>
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}