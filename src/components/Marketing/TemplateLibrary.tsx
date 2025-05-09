import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Copy, Trash2, X } from 'lucide-react';
import { Card } from '../ui/card';
import { TemplateService } from '../../lib/services/TemplateService';
import { Template } from '../../types/marketing';

interface TemplateLibraryProps {
  onSelectTemplate?: (template: Template) => void;
  onClose?: () => void;
  standalone?: boolean;
}

export default function TemplateLibrary({
  onSelectTemplate,
  onClose,
  standalone = false
}: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

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

  const handleDuplicateTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await TemplateService.duplicateTemplate(id);
      loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await TemplateService.deleteTemplate(id);
        loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const templateTypes = Array.from(new Set(templates.map(t => t.type)));

  const renderContent = () => (
    <div className="space-y-6">
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
        <button
          onClick={() => {/* Navigate to new template */}}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      <div className="flex">
        <div className="w-48 pr-6">
          <h3 className="font-medium text-gray-900 mb-2">Template Type</h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedType(null)}
              className={`w-full text-left px-3 py-2 rounded-md ${
                !selectedType ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
              }`}
            >
              All Templates
            </button>
            {templateTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full text-left px-3 py-2 rounded-md capitalize ${
                  selectedType === type ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </Card>
              ))
            ) : filteredTemplates.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No templates found matching your criteria
              </div>
            ) : (
              filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectTemplate && onSelectTemplate(template)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDuplicateTemplate(template.id, e)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={(e) => {/* Navigate to edit template */}}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTemplate(template.id, e)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {template.subject || 'No subject'}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                        {template.type}
                      </span>
                      <span className="text-gray-500">
                        Last edited: {new Date(template.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>Email Templates</h1>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Email Templates</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}