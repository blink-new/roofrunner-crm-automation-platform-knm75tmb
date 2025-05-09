import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Save, X } from 'lucide-react';
import { Dashboard } from '../../types/dashboard';

interface DashboardSettingsProps {
  dashboard: Dashboard;
  onSave: (updates: Partial<Dashboard>) => Promise<void>;
  onClose: () => void;
}

export default function DashboardSettings({
  dashboard,
  onSave,
  onClose
}: DashboardSettingsProps) {
  const [name, setName] = useState(dashboard.name);
  const [description, setDescription] = useState(dashboard.description || '');
  const [isDefault, setIsDefault] = useState(dashboard.isDefault || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      await onSave({
        name,
        description,
        isDefault
      });
      onClose();
    } catch (error) {
      console.error('Error saving dashboard settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Dashboard Settings</h2>
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
                Dashboard Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border-gray-300"
                rows={3}
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Set as default dashboard
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                This dashboard will be shown by default when users log in
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}