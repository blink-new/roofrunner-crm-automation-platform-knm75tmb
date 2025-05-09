import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Plus, Trash2, Clock, 
  ArrowRight, Settings, Users 
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { DripService } from '../../lib/services/DripService';

export default function DripBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<{
    id: string;
    name: string;
    type: 'email' | 'sms' | 'delay' | 'condition';
    content?: string;
    subject?: string;
    delay?: number;
    delay_unit?: 'minutes' | 'hours' | 'days';
    condition?: string;
  }[]>([]);
  const [batchSize, setBatchSize] = useState(100);
  const [batchInterval, setBatchInterval] = useState(60); // minutes
  const [isSaving, setIsSaving] = useState(false);
  const [goalEvent, setGoalEvent] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadDripSequence();
    } else {
      // Initialize with a first step
      setSteps([
        {
          id: crypto.randomUUID(),
          name: 'Welcome Email',
          type: 'email',
          content: '',
          subject: ''
        }
      ]);
    }
  }, [id]);

  const loadDripSequence = async () => {
    try {
      const sequence = await DripService.getDripSequence(id!);
      setName(sequence.name);
      setDescription(sequence.description || '');
      setSteps(sequence.steps || []);
      
      if (sequence.batch_settings) {
        setBatchSize(sequence.batch_settings.batch_size || 100);
        setBatchInterval(sequence.batch_settings.interval_minutes || 60);
      }
      
      setGoalEvent(sequence.goal_event || '');
    } catch (error) {
      console.error('Error loading drip sequence:', error);
    }
  };

  const handleAddStep = (type: 'email' | 'sms' | 'delay' | 'condition') => {
    const newStep = {
      id: crypto.randomUUID(),
      name: `Step ${steps.length + 1}`,
      type
    };

    if (type === 'email') {
      newStep.subject = '';
      newStep.content = '';
    } else if (type === 'sms') {
      newStep.content = '';
    } else if (type === 'delay') {
      newStep.delay = 1;
      newStep.delay_unit = 'days';
    } else if (type === 'condition') {
      newStep.condition = '';
    }

    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleUpdateStep = (id: string, updates: Partial<typeof steps[0]>) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const sequenceData = {
        name,
        description,
        steps,
        batch_settings: {
          batch_size: batchSize,
          interval_minutes: batchInterval
        },
        goal_event: goalEvent
      };
      
      if (isEditing) {
        await DripService.updateDripSequence(id!, sequenceData);
      } else {
        const newSequence = await DripService.createDripSequence(sequenceData);
        navigate(`/marketing/drip/${newSequence.id}`);
      }
    } catch (error) {
      console.error('Error saving drip sequence:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigureBatch = async () => {
    try {
      if (isEditing) {
        await DripService.configureBatch(id!, batchSize, batchInterval);
        alert('Batch settings updated');
      }
    } catch (error) {
      console.error('Error configuring batch settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Marketing', path: '/marketing' },
              { 
                label: isEditing ? 'Edit Drip Sequence' : 'New Drip Sequence', 
                path: isEditing ? `/marketing/drip/${id}` : '/marketing/drip/new', 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/marketing')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Drip Sequence' : 'New Drip Sequence'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Sequence'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sequence Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter sequence name"
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
                  rows={2}
                  placeholder="Enter sequence description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Sequence Steps</h3>
                  <div className="flex gap-2">
                    <div className="relative group">
                      <button className="btn btn-secondary inline-flex items-center gap-2">
                        <Plus size={16} />
                        <span>Add Step</span>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                        <button
                          onClick={() => handleAddStep('email')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Email
                        </button>
                        <button
                          onClick={() => handleAddStep('sms')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          SMS
                        </button>
                        <button
                          onClick={() => handleAddStep('delay')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Delay
                        </button>
                        <button
                          onClick={() => handleAddStep('condition')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Condition
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {steps.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">
                        No steps added yet. Click "Add Step" to start building your sequence.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {steps.map((step, index) => (
                        <div key={step.id} className="relative">
                          {index > 0 && (
                            <div className="absolute left-6 -top-6 h-6 w-0.5 bg-gray-300"></div>
                          )}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                  {index + 1}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={step.name}
                                    onChange={(e) => handleUpdateStep(step.id, { name: e.target.value })}
                                    className="font-medium border-none focus:ring-0 p-0"
                                    placeholder="Step name"
                                  />
                                  <p className="text-sm text-gray-500 capitalize">{step.type}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveStep(step.id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {step.type === 'email' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject Line
                                  </label>
                                  <input
                                    type="text"
                                    value={step.subject || ''}
                                    onChange={(e) => handleUpdateStep(step.id, { subject: e.target.value })}
                                    className="w-full rounded-md border-gray-300"
                                    placeholder="Enter subject line"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Content
                                  </label>
                                  <textarea
                                    value={step.content || ''}
                                    onChange={(e) => handleUpdateStep(step.id, { content: e.target.value })}
                                    className="w-full rounded-md border-gray-300"
                                    rows={3}
                                    placeholder="Enter email content"
                                  />
                                </div>
                              </div>
                            )}

                            {step.type === 'sms' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Message Content
                                </label>
                                <textarea
                                  value={step.content || ''}
                                  onChange={(e) => handleUpdateStep(step.id, { content: e.target.value })}
                                  className="w-full rounded-md border-gray-300"
                                  rows={3}
                                  placeholder="Enter SMS content"
                                />
                              </div>
                            )}

                            {step.type === 'delay' && (
                              <div className="flex items-center gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Wait
                                  </label>
                                  <input
                                    type="number"
                                    value={step.delay || 1}
                                    onChange={(e) => handleUpdateStep(step.id, { delay: parseInt(e.target.value) })}
                                    className="w-20 rounded-md border-gray-300"
                                    min="1"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit
                                  </label>
                                  <select
                                    value={step.delay_unit || 'days'}
                                    onChange={(e) => handleUpdateStep(step.id, { delay_unit: e.target.value as any })}
                                    className="rounded-md border-gray-300"
                                  >
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {step.type === 'condition' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Condition
                                </label>
                                <select
                                  value={step.condition || ''}
                                  onChange={(e) => handleUpdateStep(step.id, { condition: e.target.value })}
                                  className="w-full rounded-md border-gray-300"
                                >
                                  <option value="">Select a condition...</option>
                                  <option value="opened_previous">Opened previous email</option>
                                  <option value="clicked_previous">Clicked previous email</option>
                                  <option value="not_opened_previous">Did not open previous email</option>
                                  <option value="not_clicked_previous">Did not click previous email</option>
                                </select>
                              </div>
                            )}
                          </div>
                          {index < steps.length - 1 && (
                            <div className="flex justify-center my-2">
                              <ArrowRight size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Sequence Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Size
                </label>
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300"
                  min="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Number of recipients per batch
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Interval (minutes)
                </label>
                <input
                  type="number"
                  value={batchInterval}
                  onChange={(e) => setBatchInterval(parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300"
                  min="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Time between batches
                </p>
              </div>

              {isEditing && (
                <button
                  onClick={handleConfigureBatch}
                  className="w-full btn btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  <span>Update Batch Settings</span>
                </button>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Goal Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Event
                </label>
                <select
                  value={goalEvent}
                  onChange={(e) => setGoalEvent(e.target.value)}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">No goal (run entire sequence)</option>
                  <option value="purchase">Made a purchase</option>
                  <option value="signup">Signed up</option>
                  <option value="form_submission">Submitted a form</option>
                  <option value="page_visit">Visited a specific page</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Stop sequence when contact completes this goal
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Recipients</h3>
            <div className="space-y-4">
              <button
                className="w-full btn btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Users size={16} />
                <span>Manage Recipients</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}