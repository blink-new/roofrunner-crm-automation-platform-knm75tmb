import React from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ImportWizardProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export default function ImportWizard({ onClose, onImportComplete }: ImportWizardProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Import Opportunities</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-2">
              <p className="text-gray-600">
                Drag and drop your CSV file here, or click to select a file
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: CSV
              </p>
            </div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                // Handle file upload
              }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle import
                onImportComplete();
              }}
              className="btn btn-primary"
            >
              Import
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}