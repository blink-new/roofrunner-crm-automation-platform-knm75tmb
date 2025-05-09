import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ChevronLeft, Plus, Trash2, ArrowUp, 
  ArrowDown, Settings, BarChart2, Layout
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import SplitTestManager from './SplitTestManager';
import { FunnelService } from '../../lib/services/FunnelService';
import { SiteService } from '../../lib/services/SiteService';
import { FunnelPage } from '../../types/sites';

export default function FunnelEditor() {
  const { siteId, funnelId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(funnelId) && funnelId !== 'new';
  
  const [funnel, setFunnel] = useState<any>({
    name: '',
    description: '',
    pages: []
  });
  const [site, setSite] = useState<any>(null);
  const [pages, setPages] = useState<FunnelPage[]>([]);
  const [showSplitTest, setShowSplitTest] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSite();
    if (isEditing) {
      loadFunnel();
    }
  }, [siteId, funnelId]);

  const loadSite = async () => {
    try {
      if (siteId) {
        const siteData = await SiteService.getSite(siteId);
        setSite(siteData);
      }
    } catch (error) {
      console.error('Error loading site:', error);
    }
  };

  const loadFunnel = async () => {
    try {
      const funnelData = await FunnelService.getFunnel(funnelId!);
      setFunnel(funnelData);
      setPages(funnelData.pages || []);
    } catch (error) {
      console.error('Error loading funnel:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await FunnelService.updateFunnel(funnelId!, {
          name: funnel.name,
          description: funnel.description
        });
      } else {
        const newFunnel = await FunnelService.createFunnel({
          site_id: siteId!,
          name: funnel.name,
          description: funnel.description,
          pages: []
        });
        
        navigate(`/sites/${siteId}/funnels/${newFunnel.id}`);
      }
    } catch (error) {
      console.error('Error saving funnel:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPage = async () => {
    try {
      const newPage = await FunnelService.createFunnelPage({
        funnel_id: funnelId!,
        name: `Page ${pages.length + 1}`,
        type: 'landing',
        slug: `page-${pages.length + 1}`,
        content: { sections: [], styles: {} },
        meta: { title: `Page ${pages.length + 1}` },
        status: 'draft',
        position: pages.length
      });
      
      setPages([...pages, newPage]);
    } catch (error) {
      console.error('Error adding page:', error);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await FunnelService.deleteFunnelPage(id);
        setPages(pages.filter(page => page.id !== id));
        if (selectedPage === id) {
          setSelectedPage(null);
        }
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  const handleMovePage = async (id: string, direction: 'up' | 'down') => {
    const pageIndex = pages.findIndex(page => page.id === id);
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
    
    // Update positions
    const updatedPages = newPages.map((page, index) => ({
      ...page,
      position: index
    }));
    
    setPages(updatedPages);
    
    // Update in database
    try {
      await FunnelService.updatePageOrder(funnelId!, updatedPages.map((page, index) => ({
        id: page.id,
        position: index
      })));
    } catch (error) {
      console.error('Error updating page order:', error);
      // Revert to original order on error
      setPages(pages);
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
              ...(site ? [{ label: site.name, path: `/sites/${siteId}` }] : []),
              { label: 'Funnels', path: `/sites/${siteId}/funnels` },
              { 
                label: isEditing ? funnel.name : 'New Funnel', 
                path: isEditing ? `/sites/${siteId}/funnels/${funnelId}` : `/sites/${siteId}/funnels/new`, 
                active: true 
              }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate(`/sites/${siteId}/funnels`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>{isEditing ? 'Edit Funnel' : 'New Funnel'}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <>
              <button
                onClick={() => navigate(`/sites/${siteId}/funnels/${funnelId}/analytics`)}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <BarChart2 size={16} />
                <span>Analytics</span>
              </button>
              
              <button
                onClick={() => setShowSplitTest(true)}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <Layout size={16} />
                <span>Split Test</span>
              </button>
            </>
          )}
          
          <button
            onClick={handleSave}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Funnel'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funnel Name
                </label>
                <input
                  type="text"
                  value={funnel.name}
                  onChange={(e) => setFunnel({ ...funnel, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="Enter funnel name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={funnel.description || ''}
                  onChange={(e) => setFunnel({ ...funnel, description: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  rows={3}
                  placeholder="Enter funnel description"
                />
              </div>

              {isEditing && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Funnel Pages</h3>
                    <button
                      onClick={handleAddPage}
                      className="btn btn-secondary inline-flex items-center gap-2"
                    >
                      <Plus size={16} />
                      <span>Add Page</span>
                    </button>
                  </div>

                  {pages.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">
                        No pages added yet. Click "Add Page" to start building your funnel.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pages.map((page, index) => (
                        <div
                          key={page.id}
                          className={`border rounded-lg p-4 ${
                            selectedPage === page.id ? 'border-primary-500 bg-primary-50' : ''
                          }`}
                          onClick={() => setSelectedPage(page.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{page.name}</h4>
                                <p className="text-sm text-gray-500 capitalize">
                                  {page.type} • {page.status}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/sites/${siteId}/funnels/${funnelId}/pages/${page.id}`);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                title="Edit page"
                              >
                                <Settings size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMovePage(page.id, 'up');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                title="Move up"
                                disabled={index === 0}
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMovePage(page.id, 'down');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                title="Move down"
                                disabled={index === pages.length - 1}
                              >
                                <ArrowDown size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePage(page.id);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                title="Delete page"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Funnel Preview</h3>
            {isEditing && pages.length > 0 ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    {pages.map((page, index) => (
                      <React.Fragment key={page.id}>
                        <div className="w-32 h-20 border rounded-md flex items-center justify-center bg-gray-50">
                          <span className="text-sm font-medium">{page.name}</span>
                        </div>
                        {index < pages.length - 1 && (
                          <div className="h-8 border-l border-gray-300"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Total Pages: {pages.length}</p>
                  <p>Created: {new Date(funnel.created_at).toLocaleDateString()}</p>
                  {funnel.updated_at && (
                    <p>Last Updated: {new Date(funnel.updated_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  {isEditing
                    ? 'Add pages to see your funnel preview'
                    : 'Save the funnel first to add pages'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showSplitTest && (
        <SplitTestManager
          funnelId={funnelId!}
          onClose={() => setShowSplitTest(false)}
        />
      )}
    </div>
  );
}