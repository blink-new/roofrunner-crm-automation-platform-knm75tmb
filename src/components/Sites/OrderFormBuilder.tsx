import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Plus, Trash2, 
  DollarSign, CreditCard, ArrowRight
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { OrderFormService } from '../../lib/services/OrderFormService';

export default function OrderFormBuilder() {
  const { siteId, funnelId, pageId, formId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(formId) && formId !== 'new';
  
  const [form, setForm] = useState<any>({
    funnel_id: funnelId,
    page_id: pageId,
    name: 'Order Form',
    description: '',
    payment_methods: ['card'],
    products: [
      {
        name: 'Product',
        description: '',
        price: 0,
        currency: 'USD',
        quantity: 1
      }
    ],
    success_message: 'Thank you for your order!',
    redirect_url: ''
  });
  const [upsells, setUpsells] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadOrderForm();
    }
  }, [formId]);

  const loadOrderForm = async () => {
    try {
      const formData = await OrderFormService.getOrderForm(formId!);
      setForm(formData);
      setUpsells(formData.upsells || []);
    } catch (error) {
      console.error('Error loading order form:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await OrderFormService.updateOrderForm(formId!, {
          ...form,
          upsells
        });
      } else {
        const newForm = await OrderFormService.createOrderForm({
          ...form,
          upsells
        });
        navigate(`/sites/${siteId}/funnels/${funnelId}/pages/${pageId}/order-forms/${newForm.id}`);
      }
    } catch (error) {
      console.error('Error saving order form:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        {
          name: `Product ${form.products.length + 1}`,
          description: '',
          price: 0,
          currency: 'USD',
          quantity: 1
        }
      ]
    });
  };

  const handleUpdateProduct = (index: number, updates: any) => {
    const newProducts = [...form.products];
    newProducts[index] = { ...newProducts[index], ...updates };
    setForm({ ...form, products: newProducts });
  };

  const handleRemoveProduct = (index: number) => {
    setForm({
      ...form,
      products: form.products.filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddUpsell = () => {
    const newUpsell = {
      order_form_id: formId,
      name: `Upsell ${upsells.length + 1}`,
      description: '',
      price: 0,
      currency: 'USD',
      position: upsells.length,
      type: 'upsell',
      trigger: 'purchase'
    };
    
    setUpsells([...upsells, newUpsell]);
  };

  const handleUpdateUpsell = (index: number, updates: any) => {
    const newUpsells = [...upsells];
    newUpsells[index] = { ...newUpsells[index], ...updates };
    setUpsells(newUpsells);
  };

  const handleRemoveUpsell = (index: number) => {
    setUpsells(upsells.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Websites & Funnels', path: '/sites' },
              { label: 'Funnels', path: `/sites/${siteId}/funnels` },
              { label: 'Pages', path: `/sites/${siteId}/funnels/${funnelId}` },
              { 
                label: isEditing ? 'Edit Order Form' : 'New Order Form', 
                path: isEditing 
                  ? `/sites/${siteId}/funnels/${funnelId}/pages/${pageId}/order-forms/${formId}` 
                  : `/sites/${siteId}/funnels/${funnelId}/pages/${pageId}/order-forms/new`, 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate(`/sites/${siteId}/funnels/${funnelId}/pages/${pageId}`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Order Form' : 'New Order Form'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Form'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter form name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={2}
                  placeholder="Enter form description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Products</h3>
                  <button
                    onClick={handleAddProduct}
                    className="btn btn-secondary inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {form.products.map((product: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Product {index + 1}</h4>
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                          </label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => handleUpdateProduct(index, { name: e.target.value })}
                            className="w-full rounded-md border-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={product.description}
                            onChange={(e) => handleUpdateProduct(index, { description: e.target.value })}
                            className="w-full rounded-md border-gray-300"
                            rows={2}
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
                                value={product.price}
                                onChange={(e) => handleUpdateProduct(index, { price: parseFloat(e.target.value) })}
                                className="w-full pl-7 rounded-md border-gray-300"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleUpdateProduct(index, { quantity: parseInt(e.target.value) })}
                              className="w-full rounded-md border-gray-300"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Upsells & Downsells</h3>
                    <button
                      onClick={handleAddUpsell}
                      className="btn btn-secondary inline-flex items-center gap-2"
                    >
                      <Plus size={16} />
                      <span>Add Upsell</span>
                    </button>
                  </div>

                  {upsells.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">
                        No upsells added yet. Click "Add Upsell" to increase your average order value.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upsells.map((upsell, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">{upsell.name}</h4>
                            <button
                              onClick={() => handleRemoveUpsell(index)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upsell Name
                              </label>
                              <input
                                type="text"
                                value={upsell.name}
                                onChange={(e) => handleUpdateUpsell(index, { name: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={upsell.description}
                                onChange={(e) => handleUpdateUpsell(index, { description: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                                rows={2}
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
                                    value={upsell.price}
                                    onChange={(e) => handleUpdateUpsell(index, { price: parseFloat(e.target.value) })}
                                    className="w-full pl-7 rounded-md border-gray-300"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Type
                                </label>
                                <select
                                  value={upsell.type}
                                  onChange={(e) => handleUpdateUpsell(index, { type: e.target.value })}
                                  className="w-full rounded-md border-gray-300"
                                >
                                  <option value="upsell">Upsell</option>
                                  <option value="downsell">Downsell</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trigger
                              </label>
                              <select
                                value={upsell.trigger}
                                onChange={(e) => handleUpdateUpsell(index, { trigger: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                              >
                                <option value="purchase">After Purchase</option>
                                <option value="decline">After Decline</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Methods
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.payment_methods.includes('card')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                payment_methods: [...form.payment_methods, 'card']
                              });
                            } else {
                              setForm({
                                ...form,
                                payment_methods: form.payment_methods.filter((m: string) => m !== 'card')
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Credit/Debit Card</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.payment_methods.includes('paypal')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                payment_methods: [...form.payment_methods, 'paypal']
                              });
                            } else {
                              setForm({
                                ...form,
                                payment_methods: form.payment_methods.filter((m: string) => m !== 'paypal')
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">PayPal</span>
                      </label>
                    </div>
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
                      If provided, customers will be redirected to this URL after successful payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg">{form.name}</h4>
                  <p className="text-sm text-gray-500">{form.description}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium mb-2">Products</h5>
                  <div className="space-y-2">
                    {form.products.map((product: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">
                          {product.name} {product.quantity > 1 ? `(x${product.quantity})` : ''}
                        </span>
                        <span className="text-sm font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      ${form.products.reduce((total: number, product: any) => 
                        total + (product.price * product.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="w-full py-2 bg-primary-500 text-white rounded-md flex items-center justify-center gap-2">
                    <CreditCard size={16} />
                    <span>Complete Order</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {isEditing && upsells.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Funnel Flow</h3>
              <div className="border rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <div className="w-full p-3 bg-gray-100 rounded-md text-center mb-2">
                    Order Form
                  </div>
                  <div className="h-8 border-l border-gray-300"></div>
                  <div className="w-full p-3 bg-green-100 rounded-md text-center mb-2">
                    Thank You Page
                  </div>
                  
                  {upsells.map((upsell, index) => (
                    <React.Fragment key={index}>
                      <div className="h-8 border-l border-gray-300"></div>
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight size={16} className="text-gray-400" />
                        <div className="w-full p-3 bg-blue-100 rounded-md text-center">
                          {upsell.name} ({upsell.type})
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}