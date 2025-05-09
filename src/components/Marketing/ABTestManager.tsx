import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Copy, BarChart2 } from 'lucide-react';
import { Card } from '../ui/card';
import { ABTestService } from '../../lib/services/ABTestService';

interface ABTestManagerProps {
  campaignId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ABTestManager({
  campaignId,
  onClose,
  onSave
}: ABTestManagerProps) {
  const [variants, setVariants] = useState<{
    id: string;
    name: string;
    content: string;
    subject?: string;
    traffic_split: number;
  }[]>([
    { id: '1', name: 'Variant A', content: '', traffic_split: 50 },
    { id: '2', name: 'Variant B', content: '', traffic_split: 50 }
  ]);
  const [testName, setTestName] = useState('A/B Test');
  const [testMetric, setTestMetric] = useState('open_rate');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadExistingTest();
    }
  }, [campaignId]);

  const loadExistingTest = async () => {
    try {
      const tests = await ABTestService.getABTests(campaignId);
      if (tests.length > 0) {
        const test = await ABTestService.getABTest(tests[0].id);
        setTestName(test.name);
        setTestMetric(test.winning_metric || 'open_rate');
        setVariants(test.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          content: v.content,
          subject: v.subject,
          traffic_split: v.traffic_split
        })));
      }
    } catch (error) {
      console.error('Error loading A/B test:', error);
    }
  };

  const handleAddVariant = () => {
    if (variants.length >= 5) {
      alert('Maximum 5 variants allowed');
      return;
    }

    const newSplit = Math.floor(100 / (variants.length + 1));
    const updatedVariants = variants.map(v => ({
      ...v,
      traffic_split: newSplit
    }));

    setVariants([
      ...updatedVariants,
      {
        id: crypto.randomUUID(),
        name: `Variant ${String.fromCharCode(65 + variants.length)}`, // A, B, C, etc.
        content: '',
        traffic_split: newSplit
      }
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 2) {
      alert('Minimum 2 variants required');
      return;
    }

    const newVariants = variants.filter(v => v.id !== id);
    const newSplit = Math.floor(100 / newVariants.length);
    
    setVariants(newVariants.map(v => ({
      ...v,
      traffic_split: newSplit
    })));
  };

  const handleSplitChange = (id: string, value: number) => {
    // Ensure value is between 1 and 99
    const clampedValue = Math.max(1, Math.min(99, value));
    
    // Calculate remaining percentage
    const remaining = 100 - clampedValue;
    const otherVariants = variants.filter(v => v.id !== id);
    const totalOtherSplit = otherVariants.reduce((sum, v) => sum + v.traffic_split, 0);
    
    // Distribute remaining percentage proportionally
    const updatedVariants = variants.map(v => {
      if (v.id === id) {
        return { ...v, traffic_split: clampedValue };
      } else {
        const ratio = v.traffic_split / totalOtherSplit;
        return { ...v, traffic_split: Math.floor(remaining * ratio) };
      }
    });
    
    // Adjust for rounding errors
    const total = updatedVariants.reduce((sum, v) => sum + v.traffic_split, 0);
    if (total < 100) {
      updatedVariants[updatedVariants.length - 1].traffic_split += (100 - total);
    }
    
    setVariants(updatedVariants);
  };

  const handleSaveTest = async () => {
    try {
      setIsSaving(true);
      
      await ABTestService.createABTest({
        campaign_id: campaignId,
        name: testName,
        variants: variants.map(v => ({
          name: v.name,
          content: v.content,
          subject: v.subject,
          traffic_split: v.traffic_split
        }))
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving A/B test:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">A/B Test Setup</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Name
            </label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full rounded-md border-gray-300"
              placeholder="e.g., Subject Line Test"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Winning Metric
            </label>
            <select
              value={testMetric}
              onChange={(e) => setTestMetric(e.target.value)}
              className="w-full rounded-md border-gray-300"
            >
              <option value="open_rate">Open Rate</option>
              <option value="click_rate">Click Rate</option>
              <option value="conversion_rate">Conversion Rate</option>
              <option value="revenue">Revenue</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The system will automatically select a winner based on this metric
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Variants</h3>
              <button
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus size={14} />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].name = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="font-medium border-none focus:ring-0 p-0"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Copy variant
                          const newVariant = { ...variant, id: crypto.randomUUID() };
                          handleAddVariant();
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Duplicate variant"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Remove variant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={variant.subject || ''}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].subject = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="w-full rounded-md border-gray-300"
                        placeholder="Enter subject line"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={variant.content}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].content = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="w-full rounded-md border-gray-300"
                        rows={3}
                        placeholder="Enter email content"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Traffic Split: {variant.traffic_split}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="99"
                        value={variant.traffic_split}
                        onChange={(e) => handleSplitChange(variant.id, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">
                  Automatically send winning variant to remaining audience
                </span>
              </label>
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  After
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="w-20 rounded-md border-gray-300"
                    min="1"
                    defaultValue="24"
                  />
                  <span className="text-sm text-gray-700">hours</span>
                </div>
              </div>
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
            onClick={handleSaveTest}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <BarChart2 size={16} />
            <span>{isSaving ? 'Saving...' : 'Create A/B Test'}</span>
          </button>
        </div>
      </Card>
    </div>
  );
}