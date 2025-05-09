import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { Card } from '../ui/card';

interface CustomField {
  id: string;
  name: string;
  type: string;
  folder?: string;
  value?: any;
  required?: boolean;
  options?: string[];
}

interface CustomFieldsProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  hideEmpty?: boolean;
}

export default function CustomFields({
  fields,
  values,
  onChange,
  hideEmpty = false
}: CustomFieldsProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const fieldsByFolder = fields.reduce((acc, field) => {
    const folder = field.folder || 'General';
    if (!acc[folder]) acc[folder] = [];
    if (!hideEmpty || values[field.id] !== undefined) {
      acc[folder].push(field);
    }
    return acc;
  }, {} as Record<string, CustomField[]>);

  const renderField = (field: CustomField) => {
    const value = values[field.id];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange({ ...values, [field.id]: e.target.value })}
            className="w-full rounded-md border-gray-300"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange({ ...values, [field.id]: e.target.value })}
            className="w-full rounded-md border-gray-300"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange({ ...values, [field.id]: e.target.value })}
            className="w-full rounded-md border-gray-300"
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange({ ...values, [field.id]: e.target.checked })}
            className="rounded border-gray-300 text-primary-600"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Custom Fields</h3>
          {hideEmpty && (
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Show Empty Fields
            </button>
          )}
        </div>

        <div className="space-y-4">
          {Object.entries(fieldsByFolder).map(([folder, folderFields]) => (
            <div key={folder} className="border rounded-lg">
              <button
                onClick={() => toggleFolder(folder)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
              >
                <span className="font-medium">{folder}</span>
                {expandedFolders.includes(folder) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {expandedFolders.includes(folder) && (
                <div className="p-4 border-t space-y-4">
                  {folderFields.map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}