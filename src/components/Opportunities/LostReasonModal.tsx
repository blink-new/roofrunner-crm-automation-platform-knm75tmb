import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/card';

interface LostReasonModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  commonReasons?: string[];
}

export default function LostReasonModal({
  onClose,
  onSubmit,
  commonReasons = [
    'Price too high',
    'Chose competitor',
    'No budget',
    'No decision maker',
    'Project cancelled',
    'Bad timing',
    'Other'
  ]
}: LostReasonModalProps) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason && !customReason) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(reason === 'Other' ? customReason : reason);
      onClose();
    } catch (error) {
      console.error('Error saving lost reason:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Mark as Lost</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Loss
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">Select a reason...</option>
              {commonReasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {reason === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Reason
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full rounded-md border-gray-300"
                rows={3}
                placeholder="Enter custom reason..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
            disabled={isSubmitting || (!reason && !customReason)}
          >
            Mark as Lost
          </button>
        </div>
      </Card>
    </div>
  );
}