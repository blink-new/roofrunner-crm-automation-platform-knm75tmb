import React, { useState } from 'react';
import { Plus, X, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { ContactFilters } from '../../types/contacts';

interface SmartListFilterProps {
  onFilterChange: (filters: ContactFilters) => void;
  onSave?: (name: string, filters: ContactFilters) => void;
}

export default function SmartListFilter({ onFilterChange, onSave }: SmartListFilterProps) {
  const [filters, setFilters] = useState<ContactFilters>({});
  const [conditions, setConditions] = useState<Array<{
    field: string;
    operator: string;
    value: string;
  }>>([]);
  const [listName, setListName] = useState('');

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: 'equals', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<typeof conditions[0]>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const handleSave = () => {
    if (onSave && listName) {
      onSave(listName, filters);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Smart List Filter</h3>
          {onSave && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="List name"
                className="px-3 py-1 border rounded-md"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={!listName}
              >
                Save List
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                value={condition.field}
                onChange={(e) => updateCondition(index, { field: e.target.value })}
                className="rounded-md border-gray-300"
              >
                <option value="">Select field</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="type">Type</option>
                <option value="tags">Tags</option>
                <option value="custom_fields">Custom Fields</option>
              </select>

              <select
                value={condition.operator}
                onChange={(e) => updateCondition(index, { operator: e.target.value })}
                className="rounded-md border-gray-300"
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Does not equal</option>
                <option value="contains">Contains</option>
                <option value="starts_with">Starts with</option>
                <option value="ends_with">Ends with</option>
                <option value="greater_than">Greater than</option>
                <option value="less_than">Less than</option>
              </select>

              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(index, { value: e.target.value })}
                className="flex-1 rounded-md border-gray-300"
                placeholder="Value"
              />

              <button
                onClick={() => removeCondition(index)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={addCondition}
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus size={16} />
            <span>Add Condition</span>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onFilterChange(filters)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </Card>
  );
}