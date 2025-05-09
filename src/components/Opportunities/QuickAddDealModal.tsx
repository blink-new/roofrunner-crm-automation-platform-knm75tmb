import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Search } from 'lucide-react';
import { Card } from '../ui/card';
import { Contact } from '../../types/contacts';
import { DealFormData } from '../../types/deals';

interface QuickAddDealModalProps {
  onClose: () => void;
  onSave: (deal: DealFormData, createAnother: boolean) => Promise<void>;
}

export default function QuickAddDealModal({ onClose, onSave }: QuickAddDealModalProps) {
  const [formData, setFormData] = useState<DealFormData>({
    name: '',
    pipeline_id: '',
    stage_id: '',
    contact_id: '',
    amount: undefined,
    currency: 'USD',
    expected_close_date: '',
    probability: 0,
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  useEffect(() => {
    const input = document.getElementById('opportunity_name');
    if (input) input.focus();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.pipeline_id) newErrors.pipeline_id = 'Required';
    if (!formData.stage_id) newErrors.stage_id = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (createAnother: boolean) => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      await onSave(formData, createAnother);

      if (createAnother) {
        setFormData({
          ...formData,
          name: '',
          contact_id: '',
          amount: undefined,
          expected_close_date: ''
        });
        setErrors({});
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error saving opportunity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add new opportunity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Create new opportunity by filling in details and selecting a contact
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Contact details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Contact Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300"
                    value={formData.contact_id}
                    onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                  >
                    <option value="">Select Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-md border-gray-300"
                    placeholder="Enter Email"
                    disabled
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-md border-gray-300"
                    placeholder="Phone"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Opportunity Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opportunity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="opportunity_name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-md ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter opportunity name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pipeline
                    </label>
                    <select
                      value={formData.pipeline_id}
                      onChange={(e) => setFormData({ ...formData, pipeline_id: e.target.value })}
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="">Customer Pipeline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stage
                    </label>
                    <select
                      value={formData.stage_id}
                      onChange={(e) => setFormData({ ...formData, stage_id: e.target.value })}
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="">001. New Lead</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="open">Open</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opportunity Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="w-full pl-6 rounded-md border-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner
                    </label>
                    <select className="w-full rounded-md border-gray-300">
                      <option>Unassigned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Followers
                    </label>
                    <select className="w-full rounded-md border-gray-300">
                      <option>Add Followers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300"
                      placeholder="Enter Business Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opportunity Source
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300"
                      placeholder="Enter Source"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <select className="w-full rounded-md border-gray-300">
                    <option>Add tags</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            disabled={isSaving}
          >
            Create
          </button>
        </div>
      </Card>
    </div>
  );
}