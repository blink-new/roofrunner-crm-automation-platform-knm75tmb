import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Copy, Save } from 'lucide-react';
import { Card } from '../ui/card';
import { ReputationService } from '../../lib/services/ReputationService';

interface TemplateManagerProps {
  onClose?: () => void;
  onSelect?: (templateId: string) => void;
  standalone?: boolean;
}

export default function TemplateManager({
  onClose,
  onSelect,
  standalone = false
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await ReputationService.getReviewTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const template = await ReputationService.createReviewTemplate(newTemplate);
      setTemplates([...templates, template]);
      setShowNewForm(false);
      setNewTemplate({
        name: '',
        type: 'email',
        subject: '',
        content: ''
      });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      const updated = await ReputationService.updateReviewTemplate(editingTemplate.id, editingTemplate);
      setTemplates(templates.map(t => t.id === updated.id ? updated : t));
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await ReputationService.deleteReviewTemplate(id);
        setTemplates(templates.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleDuplicateTemplate = async (id: string) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    try {
      const newTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      };
      
      const created = await ReputationService.createReviewTemplate(newTemplate);
      setTemplates([...templates, created]);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'email'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email Templates
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'sms'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            SMS Templates
          </button>
        </div>
        <button
          onClick={() => {
            setShowNewForm(true);
            setNewTemplate({
              ...newTemplate,
              type: activeTab
            });
          }}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      {showNewForm && (
        <Card className="p-4 border-2 border-primary-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full rounded-md border-gray-300"
                placeholder="e.g., Post-Service Review Request"
              />
            </div>
            
            {newTemplate.type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="e.g., We'd love to hear your feedback!"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                className="w-full rounded-md border-gray-300"
                rows={6}
                placeholder={
                  newTemplate.type === 'email'
                    ? "Dear {{contact.first_name}},\n\nThank you for choosing our services. We'd love to hear about your experience.\n\nPlease take a moment to leave us a review: {{review_link}}\n\nThank you,\n{{business.name}}"
                    : "Hi {{contact.first_name}}! Thanks for choosing us. We'd love your feedback. Please leave a review here: {{review_link}}"
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                Use placeholders like {{contact.first_name}}, {{business.name}}, and {{review_link}}
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="btn btn-primary"
                disabled={!newTemplate.name || !newTemplate.content || (newTemplate.type === 'email' && !newTemplate.subject)}
              >
                Create Template
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))
        ) : templates.filter(t => t.type === activeTab).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} templates found. Create your first template to get started.
          </div>
        ) : (
          templates
            .filter(t => t.type === activeTab)
            .map(template => (
              <Card
                key={template.id}
                className={`p-4 ${
                  editingTemplate?.id === template.id ? 'border-2 border-primary-100' : ''
                }`}
              >
                {editingTemplate?.id === template.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template Name
                      </label>
                      <input
                        type="text"
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({ 
                          ...editingTemplate, 
                          name: e.target.value 
                        })}
                        className="w-full rounded-md border-gray-300"
                      />
                    </div>
                    
                    {template.type === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={editingTemplate.subject || ''}
                          onChange={(e) => setEditingTemplate({ 
                            ...editingTemplate, 
                            subject: e.target.value 
                          })}
                          className="w-full rounded-md border-gray-300"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={editingTemplate.content}
                        onChange={(e) => setEditingTemplate({ 
                          ...editingTemplate, 
                          content: e.target.value 
                        })}
                        className="w-full rounded-md border-gray-300"
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingTemplate(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTemplate}
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        {onSelect && (
                          <button
                            onClick={() => onSelect(template.id)}
                            className="p-1 text-primary-600 hover:text-primary-700"
                            title="Select template"
                          >
                            <Save size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingTemplate(template)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit template"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Duplicate template"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Delete template"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {template.type === 'email' && template.subject && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Subject: </span>
                        <span className="text-sm">{template.subject}</span>
                      </div>
                    )}
                    
                    <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                      {template.content}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Last modified: {new Date(template.updated_at).toLocaleDateString()}
                    </div>
                  </>
                )}
              </Card>
            ))
        )}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>Review Templates</h1>
        <Card className="p-6">
          {renderContent()}
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Review Templates</h2>
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