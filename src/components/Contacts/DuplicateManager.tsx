import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import type { Contact, DuplicateContact } from '../../types/contacts';

interface DuplicateManagerProps {
  duplicates: DuplicateContact[];
  onClose: () => void;
  onMerge: (original: Contact, duplicate: Contact, fields: Record<string, string>) => void;
}

export default function DuplicateManager({ duplicates, onClose, onMerge }: DuplicateManagerProps) {
  const [selectedFields, setSelectedFields] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDuplicate = duplicates[currentIndex];

  const handleFieldSelect = (field: string, value: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMerge = () => {
    onMerge(
      currentDuplicate.contact,
      duplicates[currentIndex].contact,
      selectedFields
    );
    
    if (currentIndex < duplicates.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedFields({});
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-warning-500" />
            <h2 className="text-lg font-semibold">Duplicate Contacts</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {currentIndex + 1} of {duplicates.length} potential duplicates
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Original Contact</h3>
              <div className="space-y-4">
                {Object.entries(currentDuplicate.differences).map(([field, values]) => (
                  <div key={field} className="flex items-start gap-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700">
                        {field}
                      </label>
                    </div>
                    <div className="w-2/3">
                      <div
                        className={`p-2 rounded ${
                          selectedFields[field] === 'current'
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <button
                          className="w-full text-left text-sm"
                          onClick={() => handleFieldSelect(field, 'current')}
                        >
                          {values.current || <em className="text-gray-400">Empty</em>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Duplicate Contact</h3>
              <div className="space-y-4">
                {Object.entries(currentDuplicate.differences).map(([field, values]) => (
                  <div key={field} className="flex items-start gap-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700">
                        {field}
                      </label>
                    </div>
                    <div className="w-2/3">
                      <div
                        className={`p-2 rounded ${
                          selectedFields[field] === 'duplicate'
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <button
                          className="w-full text-left text-sm"
                          onClick={() => handleFieldSelect(field, 'duplicate')}
                        >
                          {values.duplicate || <em className="text-gray-400">Empty</em>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Skip
            </button>
            <button
              onClick={handleMerge}
              className="btn btn-primary inline-flex items-center"
              disabled={Object.keys(selectedFields).length === 0}
            >
              <Check size={16} className="mr-2" />
              Merge Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}