import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Plus, Trash2, 
  DollarSign, Users, Shield
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { MembershipService } from '../../lib/services/MembershipService';

export default function MembershipBuilder() {
  const { siteId, planId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(planId) && planId !== 'new';
  
  const [plan, setPlan] = useState<any>({
    site_id: siteId,
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billing_period: 'monthly',
    features: [],
    access_rules: {
      content_types: [],
      tag_requirements: []
    }
  });
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadPlan();
    }
  }, [siteId, planId]);

  const loadPlan = async () => {
    try {
      const planData = await MembershipService.getMembershipPlan(planId!);
      setPlan(planData);
    } catch (error) {
      console.error('Error loading membership plan:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await MembershipService.updateMembershipPlan(planId!, plan);
      } else {
        const newPlan = await MembershipService.createMembershipPlan(plan);
        navigate(`/sites/${siteId}/memberships/${newPlan.id}`);
      }
    } catch (error) {
      console.error('Error saving membership plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    setPlan({
      ...plan,
      features: [...plan.features, newFeature]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setPlan({
      ...plan,
      features: plan.features.filter((_: string, i: number) => i !== index)
    });
  };

  const handleAddTag = () => {
    if (!newTag.trim() || plan.access_rules.tag_requirements.includes(newTag)) return;
    
    setPlan({
      ...plan,
      access_rules: {
        ...plan.access_rules,
        tag_requirements: [...plan.access_rules.tag_requirements, newTag]
      }
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setPlan({
      ...plan,
      access_rules: {
        ...plan.access_rules,
        tag_requirements: plan.access_rules.tag_requirements.filter((t: string) => t !== tag)
      }
    });
  };

  const toggleContentType = (type: string) => {
    const contentTypes = plan.access_rules.content_types;
    
    if (contentTypes.includes(type)) {
      setPlan({
        ...plan,
        access_rules: {
          ...plan.access_rules,
          content_types: contentTypes.filter((t: string) => t !== type)
        }
      });
    } else {
      setPlan({
        ...plan,
        access_rules: {
          ...plan.access_rules,
          content_types: [...contentTypes, type]
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Websites & Funnels', path: '/sites' },
              { label: 'Memberships', path: `/sites/${siteId}/memberships` },
              { 
                label: isEditing ? 'Edit Plan' : 'New Plan', 
                path: isEditing ? `/sites/${siteId}/memberships/${planId}` : `/sites/${siteId}/memberships/new`, 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate(`/sites/${siteId}/memberships`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Membership Plan' : 'New Membership Plan'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Plan'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="e.g., Basic, Pro, Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={plan.description}
                  onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="Describe what members get with this plan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => setPlan({ ...plan, price: parseFloat(e.target.value) })}
                      className="w-full pl-7 rounded-md border-gray-300"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={plan.currency}
                    onChange={(e) => setPlan({ ...plan, currency: e.target.value })}
                    className="w-full rounded-md border-gray-300"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Period
                </label>
                <select
                  value={plan.billing_period}
                  onChange={(e) => setPlan({ ...plan, billing_period: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one_time">One-time Payment</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                </div>
                <div className="space-y-2 mb-4">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...plan.features];
                          newFeatures[index] = e.target.value;
                          setPlan({ ...plan, features: newFeatures });
                        }}
                        className="flex-1 rounded-md border-gray-300"
                      />
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="Add a feature"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="btn btn-secondary"
                    disabled={!newFeature.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Access Rules</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Content Types</h4>
                <p className="text-xs text-gray-500 mb-2">
                  Select which content types members can access with this plan
                </p>
                <div className="space-y-2">
                  {['pages', 'blog_posts', 'downloads', 'videos'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={plan.access_rules.content_types.includes(type)}
                        onChange={() => toggleContentType(type)}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tag Requirements</h4>
                <p className="text-xs text-gray-500 mb-2">
                  Members must have these tags to access content
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {plan.access_rules.tag_requirements.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="Add a tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className="btn btn-secondary"
                    disabled={!newTag.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Plan Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-center">
                <h4 className="font-bold text-xl">{plan.name || 'Plan Name'}</h4>
                <div className="my-2">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">
                    {plan.billing_period === 'monthly' ? '/month' : 
                     plan.billing_period === 'yearly' ? '/year' : 
                     ' one-time'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{plan.description || 'Plan description'}</p>
                
                <ul className="text-left space-y-2 mb-4">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-2 bg-primary-500 text-white rounded-md">
                  Join Now
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}