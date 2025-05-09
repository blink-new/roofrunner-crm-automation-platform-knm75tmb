import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, BarChart2 } from 'lucide-react';
import { Card } from '../ui/card';
import { SplitTestService } from '../../lib/services/SplitTestService';

interface SplitTestManagerProps {
  funnelId: string;
  onClose: () => void;
}

export default function SplitTestManager({
  funnelId,
  onClose
}: SplitTestManagerProps) {
  const [splitTests, setSplitTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTest, setShowNewTest] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    page_id: '',
    variants: [
      { name: 'Variant A', content: null, traffic_split: 50 },
      { name: 'Variant B', content: null, traffic_split: 50 }
    ]
  });
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [funnelId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load funnel pages
      const pagesData = await FunnelService.getFunnelPages(funnelId);
      setPages(pagesData);
      
      // Load existing split tests
      const testsData = await Promise.all(
        pagesData.map(page => SplitTestService.getSplitTests(page.id))
      );
      
      const allTests = testsData.flat();
      setSplitTests(allTests);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    try {
      await SplitTestService.createSplitTest({
        page_id: newTest.page_id,
        name: newTest.name,
        variants: newTest.variants.map(v => ({
          name: v.name,
          content: v.content,
          traffic_split: v.traffic_split
        }))
      });
      
      setShowNewTest(false);
      loadData();
    } catch (error) {
      console.error('Error creating split test:', error);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this split test?')) {
      try {
        await SplitTestService.deleteSplitTest(id);
        loadData();
      } catch (error) {
        console.error('Error deleting split test:', error);
      }
    }
  };

  const handleDeclareWinner = async (testId: string, variantId: string) => {
    try {
      await SplitTestService.declareWinner(testId, variantId);
      loadData();
    } catch (error) {
      console.error('Error declaring winner:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Split Tests</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Split tests allow you to test different versions of your pages to see which performs better.
              </p>
              <button
                onClick={() => setShowNewTest(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} />
                <span>New Split Test</span>
              </button>
            </div>

            {showNewTest && (
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name
                  </label>
                  <input
                    type="text"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                    placeholder="e.g., Homepage Headline Test"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page to Test
                  </label>
                  <select
                    value={newTest.page_id}
                    onChange={(e) => setNewTest({ ...newTest, page_id: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="">Select a page...</option>
                    {pages.map(page => (
                      <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Variants</h3>
                    <button
                      onClick={() => {
                        if (newTest.variants.length >= 5) {
                          alert('Maximum 5 variants allowed');
                          return;
                        }
                        
                        const newSplit = Math.floor(100 / (newTest.variants.length + 1));
                        const updatedVariants = newTest.variants.map(v => ({
                          ...v,
                          traffic_split: newSplit
                        }));
                        
                        setNewTest({
                          ...newTest,
                          variants: [
                            ...updatedVariants,
                            {
                              name: `Variant ${String.fromCharCode(65 + newTest.variants.length)}`,
                              content: null,
                              traffic_split: newSplit
                            }
                          ]
                        });
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newTest.variants.map((variant, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => {
                              const newVariants = [...newTest.variants];
                              newVariants[index].name = e.target.value;
                              setNewTest({ ...newTest, variants: newVariants });
                            }}
                            className="font-medium border-none focus:ring-0 p-0"
                          />
                          {index > 1 && (
                            <button
                              onClick={() => {
                                const newVariants = newTest.variants.filter((_, i) => i !== index);
                                const newSplit = Math.floor(100 / newVariants.length);
                                
                                setNewTest({
                                  ...newTest,
                                  variants: newVariants.map(v => ({
                                    ...v,
                                    traffic_split: newSplit
                                  }))
                                });
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
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
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              const remaining = 100 - value;
                              const otherVariants = newTest.variants.filter((_, i) => i !== index);
                              const totalOtherSplit = otherVariants.reduce((sum, v) => sum + v.traffic_split, 0);
                              
                              const newVariants = newTest.variants.map((v, i) => {
                                if (i === index) {
                                  return { ...v, traffic_split: value };
                                } else {
                                  const ratio = v.traffic_split / totalOtherSplit;
                                  return { ...v, traffic_split: Math.floor(remaining * ratio) };
                                }
                              });
                              
                              setNewTest({ ...newTest, variants: newVariants });
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNewTest(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTest}
                    className="btn btn-primary"
                    disabled={!newTest.name || !newTest.page_id}
                  >
                    Create Test
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Active Tests</h3>
              {loading ? (
                <div className="text-center py-4">Loading split tests...</div>
              ) : splitTests.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No split tests found
                </div>
              ) : (
                splitTests.map(test => {
                  const page = pages.find(p => p.id === test.page_id);
                  return (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          <p className="text-sm text-gray-500">
                            Testing page: {page?.name || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {/* View test stats */}}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="View stats"
                          >
                            <BarChart2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Delete test"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {test.variants?.map((variant: any) => (
                          <div key={variant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{variant.name}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {variant.traffic_split}% traffic
                              </span>
                            </div>
                            {test.winner_variant_id === variant.id ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Winner
                              </span>
                            ) : (
                              <button
                                onClick={() => handleDeclareWinner(test.id, variant.id)}
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                Declare Winner
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}