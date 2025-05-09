import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { FormService } from '../../lib/services/FormService';

interface FormBuilderProps {
  pageId: string;
  formId?: string;
  onSave: (formId: string) => void;
}

export default function FormBuilder({ pageId, formId, onSave }: FormBuilderProps) {
  const [form, setForm] = useState<any>({
    page_id: pageId,
    name: 'Contact Form',
    fields: [],
    submit_button_text: 'Submit',
    success_message: 'Thank you for your submission!',
    mapping: {
      contact_field_mappings: {},
      opportunity_field_mappings: {}
    }
  });
  const [loading, setLoading] = useState(formId ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFieldSettings, setShowFieldSettings] = useState<string | null>(null);

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const formData = await FormService.getForm(formId!);
      setForm(formData);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      let savedForm;
      if (formId) {
        savedForm = await FormService.updateForm(formId, form);
      } else {
        savedForm = await FormService.createForm(form);
      }
      
      onSave(savedForm.id);
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddField = (type: string) => {
    const newField = {
      id: crypto.randomUUID(),
      name: `field_${form.fields.length + 1}`,
      label: `Field ${form.fields.length + 1}`,
      type,
      required: false,
      placeholder: '',
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };
    
    setForm({
      ...form,
      fields: [...form.fields, newField]
    });
  };

  const handleUpdateField = (id: string, updates: any) => {
    setForm({
      ...form,
      fields: form.fields.map((field: any) =>
        field.id === id ? { ...field, ...updates } : field
      )
    });
  };

  const handleRemoveField = (id: string) => {
    setForm({
      ...form,
      fields: form.fields.filter((field: any) => field.id !== id)
    });
    
    if (showFieldSettings === id) {
      setShowFieldSettings(null);
    }
  };

  const handleReorderFields = (startIndex: number, endIndex: number) => {
    const result = Array.from(form.fields);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setForm({
      ...form,
      fields: result
    });
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Form Builder</h3>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Form'}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Form Fields</h4>
                  <div className="relative group">
                    <button className="btn btn-secondary inline-flex items-center gap-2">
                      <Plus size={16} />
                      <span>Add Field</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                      <button
                        onClick={() => handleAddField('text')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Text Field
                      </button>
                      <button
                        onClick={() => handleAddField('email')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Email Field
                      </button>
                      <button
                        onClick={() => handleAddField('tel')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Phone Field
                      </button>
                      <button
                        onClick={() => handleAddField('textarea')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Text Area
                      </button>
                      <button
                        onClick={() => handleAddField('select')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Dropdown
                      </button>
                      <button
                        onClick={() => handleAddField('checkbox')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Checkbox
                      </button>
                      <button
                        onClick={() => handleAddField('radio')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Radio Buttons
                      </button>
                    </div>
                  </div>
                </div>

                {form.fields.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">
                      No fields added yet. Click "Add Field" to start building your form.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {form.fields.map((field: any, index: number) => (
                      <div
                        key={field.id}
                        className={`border rounded-lg p-3 ${
                          showFieldSettings === field.id ? 'border-primary-500 bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GripVertical size={16} className="text-gray-400 cursor-move" />
                            <div>
                              <span className="font-medium">{field.label}</span>
                              <span className="ml-2 text-sm text-gray-500 capitalize">
                                ({field.type})
                              </span>
                              {field.required && (
                                <span className="ml-2 text-red-500">*</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setShowFieldSettings(
                                showFieldSettings === field.id ? null : field.id
                              )}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveField(field.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {showFieldSettings === field.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Field Label
                              </label>
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Field Name
                              </label>
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Used for form submission data
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Placeholder
                              </label>
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                              />
                            </div>
                            
                            {(field.type === 'select' || field.type === 'radio') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Options
                                </label>
                                <div className="space-y-2">
                                  {field.options.map((option: string, optionIndex: number) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...field.options];
                                          newOptions[optionIndex] = e.target.value;
                                          handleUpdateField(field.id, { options: newOptions });
                                        }}
                                        className="flex-1 rounded-md border-gray-300"
                                      />
                                      <button
                                        onClick={() => {
                                          const newOptions = field.options.filter((_: any, i: number) => i !== optionIndex);
                                          handleUpdateField(field.id, { options: newOptions });
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const newOptions = [...field.options, `Option ${field.options.length + 1}`];
                                      handleUpdateField(field.id, { options: newOptions });
                                    }}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                  >
                                    Add Option
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                  className="rounded border-gray-300 text-primary-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Required field
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  value={form.submit_button_text}
                  onChange={(e) => setForm({ ...form, submit_button_text: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Success Message
                </label>
                <textarea
                  value={form.success_message}
                  onChange={(e) => setForm({ ...form, success_message: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Redirect URL (Optional)
                </label>
                <input
                  type="text"
                  value={form.redirect_url || ''}
                  onChange={(e) => setForm({ ...form, redirect_url: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="https://example.com/thank-you"
                />
                <p className="mt-1 text-xs text-gray-500">
                  If provided, users will be redirected to this URL after form submission
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Field Mapping</h4>
              <p className="text-sm text-gray-500 mb-4">
                Map form fields to contact or opportunity fields to automatically create or update records.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Contact Fields</h5>
                  <div className="space-y-2">
                    {form.fields.map((field: any) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <span className="text-sm w-1/3">{field.label}:</span>
                        <select
                          value={form.mapping.contact_field_mappings[field.name] || ''}
                          onChange={(e) => setForm({
                            ...form,
                            mapping: {
                              ...form.mapping,
                              contact_field_mappings: {
                                ...form.mapping.contact_field_mappings,
                                [field.name]: e.target.value || undefined
                              }
                            }
                          })}
                          className="flex-1 text-sm rounded-md border-gray-300"
                        >
                          <option value="">Not mapped</option>
                          <option value="first_name">First Name</option>
                          <option value="last_name">Last Name</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Opportunity Fields</h5>
                  <div className="space-y-2">
                    {form.fields.map((field: any) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <span className="text-sm w-1/3">{field.label}:</span>
                        <select
                          value={form.mapping.opportunity_field_mappings[field.name] || ''}
                          onChange={(e) => setForm({
                            ...form,
                            mapping: {
                              ...form.mapping,
                              opportunity_field_mappings: {
                                ...form.mapping.opportunity_field_mappings,
                                [field.name]: e.target.value || undefined
                              }
                            }
                          })}
                          className="flex-1 text-sm rounded-md border-gray-300"
                        >
                          <option value="">Not mapped</option>
                          <option value="name">Opportunity Name</option>
                          <option value="amount">Amount</option>
                          <option value="description">Description</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}