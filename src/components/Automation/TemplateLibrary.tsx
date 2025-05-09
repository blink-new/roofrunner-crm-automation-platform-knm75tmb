import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Search, Filter, Copy, Tag, Clock, ArrowRight } from 'lucide-react';
import { WorkflowTemplate } from '../../types/automations';
import { TemplateService } from '../../lib/services/TemplateService';

interface TemplateLibraryProps {
  onApplyTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

export default function TemplateLibrary({ onApplyTemplate, onClose }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await TemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Workflow Templates</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r p-4 overflow-y-auto">
            <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  !selectedCategory ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                }`}
              >
                All Templates
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === category ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No templates found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:border-primary-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {template.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Tag size={14} />
                        <span>{template.nodes.length} nodes</span>
                      </div>
                      <button
                        onClick={() => onApplyTemplate(template)}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <span>Use Template</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}