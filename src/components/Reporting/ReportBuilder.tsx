import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Plus, Trash2, ArrowUp, 
  ArrowDown, Settings, BarChart2, Layout,
  Type, Image, FileText, X
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { ReportService } from '../../lib/services/ReportService';
import { SnapshotService } from '../../lib/services/SnapshotService';

export default function ReportBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id) && id !== 'new';
  
  const [report, setReport] = useState<any>({
    name: '',
    description: '',
    source: 'custom',
    fields: [],
    filters: [],
    visualization: {
      type: 'bar',
      options: {}
    },
    pages: []
  });
  const [site, setSite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [coverPage, setCoverPage] = useState({
    title: '',
    logo: '',
    header: ''
  });
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [availableThemes, setAvailableThemes] = useState([
    { id: 'default', name: 'Default', primary: '#3B82F6' },
    { id: 'dark', name: 'Dark', primary: '#1F2937' },
    { id: 'light', name: 'Light', primary: '#F9FAFB' },
    { id: 'brand', name: 'Brand', primary: '#10B981' }
  ]);

  useEffect(() => {
    if (isEditing) {
      loadReport();
    } else {
      // Initialize with a first page
      setPages([
        {
          id: crypto.randomUUID(),
          name: 'Page 1',
          widgets: []
        }
      ]);
    }
  }, [id]);

  const loadReport = async () => {
    try {
      const reportData = await ReportService.getReport(id!);
      setReport(reportData);
      setPages(reportData.pages || []);
      setCoverPage(reportData.cover_page || { title: '', logo: '', header: '' });
      setSelectedTheme(reportData.theme || 'default');
      
      if (reportData.pages?.length > 0) {
        setSelectedPage(reportData.pages[0].id);
      }
    } catch (error) {
      console.error('Error loading report:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const reportData = {
        ...report,
        pages,
        cover_page: coverPage,
        theme: selectedTheme
      };
      
      if (isEditing) {
        await ReportService.updateReport(id!, reportData);
      } else {
        const newReport = await ReportService.createReport(reportData);
        navigate(`/reporting/${newReport.id}`);
      }
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPage = () => {
    const newPage = {
      id: crypto.randomUUID(),
      name: `Page ${pages.length + 1}`,
      widgets: []
    };
    
    setPages([...pages, newPage]);
    setSelectedPage(newPage.id);
  };

  const handleRenamePage = (pageId: string, newName: string) => {
    setPages(pages.map(page =>
      page.id === pageId ? { ...page, name: newName } : page
    ));
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) {
      alert('You cannot delete the only page in the report.');
      return;
    }
    
    const newPages = pages.filter(page => page.id !== pageId);
    setPages(newPages);
    
    if (selectedPage === pageId) {
      setSelectedPage(newPages[0].id);
    }
  };

  const handleMovePage = (pageId: string, direction: 'up' | 'down') => {
    const pageIndex = pages.findIndex(page => page.id === pageId);
    if (
      (direction === 'up' && pageIndex === 0) ||
      (direction === 'down' && pageIndex === pages.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? pageIndex - 1 : pageIndex + 1;
    const newPages = [...pages];
    const page = newPages[pageIndex];
    newPages.splice(pageIndex, 1);
    newPages.splice(newIndex, 0, page);
    
    setPages(newPages);
  };

  const handleAddWidget = (type: string) => {
    if (!selectedPage) return;
    
    const currentPage = pages.find(page => page.id === selectedPage);
    if (!currentPage) return;
    
    const newWidget = {
      id: crypto.randomUUID(),
      type,
      title: `New ${type} Widget`,
      size: { width: 1, height: 1 },
      position: { x: 0, y: currentPage.widgets.length },
      data: {}
    };
    
    const updatedPages = pages.map(page =>
      page.id === selectedPage
        ? { ...page, widgets: [...page.widgets, newWidget] }
        : page
    );
    
    setPages(updatedPages);
  };

  const handleApplyTemplate = async (templateId: string) => {
    try {
      const template = await SnapshotService.applyTemplate(id || 'new', templateId);
      setReport(template);
      setPages(template.pages || []);
      setCoverPage(template.cover_page || { title: '', logo: '', header: '' });
      setSelectedTheme(template.theme || 'default');
      
      if (template.pages?.length > 0) {
        setSelectedPage(template.pages[0].id);
      }
      
      setShowTemplateLibrary(false);
    } catch (error) {
      console.error('Error applying template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Reporting', path: '/reporting' },
              { 
                label: isEditing ? 'Edit Report' : 'New Report', 
                path: isEditing ? `/reporting/${id}` : '/reporting/new', 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/reporting')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Report' : 'New Report'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Layout size={16} />
            <span>Templates</span>
          </button>
          
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Report'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Report Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name
                </label>
                <input
                  type="text"
                  value={report.name}
                  onChange={(e) => setReport({ ...report, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter report name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={report.description}
                  onChange={(e) => setReport({ ...report, description: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={2}
                  placeholder="Enter report description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Source
                </label>
                <select
                  value={report.source}
                  onChange={(e) => setReport({ ...report, source: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="contacts">Contacts</option>
                  <option value="deals">Deals</option>
                  <option value="conversations">Conversations</option>
                  <option value="jobs">Jobs</option>
                  <option value="campaigns">Campaigns</option>
                  <option value="events">Events</option>
                  <option value="automations">Automations</option>
                  <option value="reputation">Reputation</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full rounded-md border-gray-300"
                >
                  {availableThemes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Cover Page</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={coverPage.title}
                  onChange={(e) => setCoverPage({ ...coverPage, title: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter cover page title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={coverPage.logo}
                  onChange={(e) => setCoverPage({ ...coverPage, logo: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter logo URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Text
                </label>
                <textarea
                  value={coverPage.header}
                  onChange={(e) => setCoverPage({ ...coverPage, header: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="Enter header text"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Pages</h3>
              <button
                onClick={handleAddPage}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                    selectedPage === page.id ? 'bg-primary-50 border border-primary-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPage(page.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                    <input
                      type="text"
                      value={page.name}
                      onChange={(e) => handleRenamePage(page.id, e.target.value)}
                      className={`text-sm border-none focus:ring-0 bg-transparent ${
                        selectedPage === page.id ? 'text-primary-700' : 'text-gray-700'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovePage(page.id, 'up');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      title="Move up"
                      disabled={index === 0}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovePage(page.id, 'down');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      title="Move down"
                      disabled={index === pages.length - 1}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      title="Delete page"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-9">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedPage 
                  ? pages.find(p => p.id === selectedPage)?.name || 'Page Editor'
                  : 'Report Builder'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddWidget('chart')}
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  <BarChart2 size={16} />
                  <span>Add Chart</span>
                </button>
                <button
                  onClick={() => handleAddWidget('table')}
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  <Layout size={16} />
                  <span>Add Table</span>
                </button>
                <button
                  onClick={() => handleAddWidget('text')}
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  <Type size={16} />
                  <span>Add Text</span>
                </button>
                <button
                  onClick={() => handleAddWidget('image')}
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  <Image size={16} />
                  <span>Add Image</span>
                </button>
              </div>
            </div>

            {selectedPage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[600px] p-4">
                {(() => {
                  const currentPage = pages.find(p => p.id === selectedPage);
                  if (!currentPage || currentPage.widgets.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Layout size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2">This page is empty</p>
                        <p className="text-sm text-gray-400">
                          Add widgets to build your report page
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {currentPage.widgets.map((widget: any) => (
                        <div 
                          key={widget.id}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{widget.title}</h3>
                            <button
                              onClick={() => {
                                const updatedPages = pages.map(page => 
                                  page.id === selectedPage
                                    ? { 
                                        ...page, 
                                        widgets: page.widgets.filter((w: any) => w.id !== widget.id)
                                      }
                                    : page
                                );
                                setPages(updatedPages);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="h-48 bg-gray-50 flex items-center justify-center">
                            {widget.type === 'chart' && <BarChart2 size={48} className="text-gray-300" />}
                            {widget.type === 'table' && <Layout size={48} className="text-gray-300" />}
                            {widget.type === 'text' && <Type size={48} className="text-gray-300" />}
                            {widget.type === 'image' && <Image size={48} className="text-gray-300" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-center">
                <FileText size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Select a page to edit</p>
                <p className="text-sm text-gray-400">
                  Choose a page from the sidebar or create a new one
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showTemplateLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Report Templates</h2>
              <button 
                onClick={() => setShowTemplateLibrary(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {['Sales Performance', 'Marketing Overview', 'Service Operations', 'Customer Insights'].map((template, index) => (
                  <Card 
                    key={index}
                    className="p-4 hover:shadow-md cursor-pointer"
                    onClick={() => handleApplyTemplate(`template-${index}`)}
                  >
                    <h3 className="font-medium mb-2">{template}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Professional {template.toLowerCase()} report with key metrics and visualizations
                    </p>
                    <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <Layout size={32} className="text-gray-400" />
                    </div>
                    <button className="w-full btn btn-secondary text-sm">
                      Use Template
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}