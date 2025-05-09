import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Copy, Trash2, 
  Settings, Code, ExternalLink, Star
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { WidgetService } from '../../lib/services/WidgetService';

export default function ReviewWidget() {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewWidget, setShowNewWidget] = useState(false);
  const [newWidget, setNewWidget] = useState({
    name: '',
    settings: {
      theme: 'light',
      show_rating: true,
      max_reviews: 5,
      platforms: ['google', 'facebook', 'yelp'],
      min_rating: 4
    }
  });
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [embedCode, setEmbedCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      const data = await WidgetService.getWidgets();
      setWidgets(data);
    } catch (error) {
      console.error('Error loading widgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWidget = async () => {
    try {
      const widget = await WidgetService.createWidget(newWidget);
      setWidgets([...widgets, widget]);
      setShowNewWidget(false);
      setNewWidget({
        name: '',
        settings: {
          theme: 'light',
          show_rating: true,
          max_reviews: 5,
          platforms: ['google', 'facebook', 'yelp'],
          min_rating: 4
        }
      });
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  const handleDeleteWidget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this widget?')) {
      try {
        await WidgetService.deleteWidget(id);
        setWidgets(widgets.filter(w => w.id !== id));
        
        if (selectedWidget?.id === id) {
          setSelectedWidget(null);
          setEmbedCode('');
          setPreviewHtml('');
        }
      } catch (error) {
        console.error('Error deleting widget:', error);
      }
    }
  };

  const handleGetEmbedCode = async (id: string) => {
    try {
      const code = await WidgetService.getWidgetEmbedCode(id);
      setEmbedCode(code);
      
      // Get widget preview
      const widget = widgets.find(w => w.id === id);
      setSelectedWidget(widget);
      
      const preview = await WidgetService.getWidgetPreview(id);
      setPreviewHtml(preview.html);
    } catch (error) {
      console.error('Error getting embed code:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reputation', path: '/reputation' },
              { label: 'Review Widgets', path: '/reputation/widgets', active: true }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/reputation')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>Review Widgets</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowNewWidget(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Widget</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Review Widgets</h3>
            
            {showNewWidget && (
              <div className="mb-6 border-2 border-primary-100 rounded-lg p-4">
                <h4 className="font-medium mb-4">New Widget</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Widget Name
                    </label>
                    <input
                      type="text"
                      value={newWidget.name}
                      onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
                      className="w-full rounded-md border-gray-300"
                      placeholder="e.g., Homepage Reviews"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      value={newWidget.settings.theme}
                      onChange={(e) => setNewWidget({
                        ...newWidget,
                        settings: {
                          ...newWidget.settings,
                          theme: e.target.value
                        }
                      })}
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Reviews
                    </label>
                    <input
                      type="number"
                      value={newWidget.settings.max_reviews}
                      onChange={(e) => setNewWidget({
                        ...newWidget,
                        settings: {
                          ...newWidget.settings,
                          max_reviews: parseInt(e.target.value)
                        }
                      })}
                      className="w-full rounded-md border-gray-300"
                      min="1"
                      max="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Rating
                    </label>
                    <select
                      value={newWidget.settings.min_rating}
                      onChange={(e) => setNewWidget({
                        ...newWidget,
                        settings: {
                          ...newWidget.settings,
                          min_rating: parseInt(e.target.value)
                        }
                      })}
                      className="w-full rounded-md border-gray-300"
                    >
                      <option value={1}>1+ Stars</option>
                      <option value={2}>2+ Stars</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={5}>5 Stars Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platforms
                    </label>
                    <div className="space-y-1">
                      {['google', 'facebook', 'yelp'].map(platform => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newWidget.settings.platforms.includes(platform)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWidget({
                                  ...newWidget,
                                  settings: {
                                    ...newWidget.settings,
                                    platforms: [...newWidget.settings.platforms, platform]
                                  }
                                });
                              } else {
                                setNewWidget({
                                  ...newWidget,
                                  settings: {
                                    ...newWidget.settings,
                                    platforms: newWidget.settings.platforms.filter(p => p !== platform)
                                  }
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowNewWidget(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateWidget}
                      className="btn btn-primary"
                      disabled={!newWidget.name}
                    >
                      Create Widget
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : widgets.length === 0 && !showNewWidget ? (
                <div className="text-center py-8 text-gray-500">
                  No widgets found. Create your first widget to get started.
                </div>
              ) : (
                widgets.map(widget => (
                  <div 
                    key={widget.id} 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedWidget?.id === widget.id ? 'border-primary-500 bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleGetEmbedCode(widget.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{widget.name}</h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open widget settings
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Widget settings"
                        >
                          <Settings size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWidget(widget.id);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Delete widget"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {widget.settings.max_reviews} reviews • {widget.settings.min_rating}+ stars
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {widget.settings.platforms.map((platform: string) => (
                        <span 
                          key={platform} 
                          className="px-2 py-0.5 bg-gray-100 rounded-full text-xs capitalize"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(widget.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {selectedWidget ? (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-medium mb-4">Widget Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {previewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="mb-4">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={24} 
                              className="text-yellow-400 fill-yellow-400" 
                            />
                          ))}
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-2xl font-bold">5.0</span>
                          <span className="text-gray-500 ml-1">based on 24 reviews</span>
                        </div>
                      </div>
                      
                      <div className="w-full max-w-md space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">John Doe</div>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <Star 
                                    key={j} 
                                    size={14} 
                                    className="text-yellow-400 fill-yellow-400" 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Great service! Would definitely recommend to others.
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>Google</span>
                              <span>2 days ago</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-medium mb-4">Embed Code</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Copy this code to your website</h4>
                    <button
                      onClick={() => navigator.clipboard.writeText(embedCode)}
                      className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                    >
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </button>
                  </div>
                  <pre className="text-xs overflow-x-auto p-4 bg-gray-900 text-gray-100 rounded-md">
                    {embedCode || '<div id="review-widget" data-widget-id="widget-id"></div>\n<script src="https://reviews.example.com/widget.js"></script>'}
                  </pre>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Installation Instructions</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                    <li>Copy the code above</li>
                    <li>Paste it into your website where you want the widget to appear</li>
                    <li>The widget will automatically load and display your reviews</li>
                  </ol>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-medium mb-4">Widget Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">247</div>
                    <div className="text-sm text-gray-500">Views</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-sm text-gray-500">Clicks</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">12.9%</div>
                    <div className="text-sm text-gray-500">Conversion Rate</div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center h-full">
              <div className="text-center py-12">
                <Star size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Widget</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a widget from the list to view its embed code and preview, or create a new widget to showcase your reviews on your website.
                </p>
                <button
                  onClick={() => setShowNewWidget(true)}
                  className="mt-4 btn btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Create New Widget</span>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}