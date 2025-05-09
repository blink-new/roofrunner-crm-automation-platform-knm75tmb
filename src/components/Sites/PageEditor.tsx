import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Eye, ChevronLeft, Undo, Redo, 
  Layout, Type, Image, Video, Square, Code, 
  Clock, Settings, Layers
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import ThemeSettings from './ThemeSettings';
import SEOSettings from './SEOSettings';
import VersionManager from './VersionManager';
import { PageService } from '../../lib/services/PageService';
import { VersionService } from '../../lib/services/VersionService';
import { PageContent, PageMeta, PageSection } from '../../types/sites';

export default function PageEditor() {
  const { siteId, funnelId, pageId } = useParams();
  const navigate = useNavigate();
  
  const [page, setPage] = useState<any>(null);
  const [content, setContent] = useState<PageContent>({ sections: [], styles: {} });
  const [meta, setMeta] = useState<PageMeta>({ title: '' });
  const [activePanel, setActivePanel] = useState<'editor' | 'theme' | 'seo' | 'versions'>('editor');
  const [history, setHistory] = useState<{ content: PageContent; meta: PageMeta }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      const pageData = await PageService.getPage(pageId!);
      setPage(pageData);
      setContent(pageData.content || { sections: [], styles: {} });
      setMeta(pageData.meta || { title: pageData.name });
      
      // Initialize history
      setHistory([{ content: pageData.content, meta: pageData.meta }]);
      setHistoryIndex(0);
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  const addToHistory = (newContent: PageContent, newMeta: PageMeta) => {
    // Remove any future history if we're not at the latest point
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content: newContent, meta: newMeta });
    
    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { content: prevContent, meta: prevMeta } = history[newIndex];
      setContent(prevContent);
      setMeta(prevMeta);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { content: nextContent, meta: nextMeta } = history[newIndex];
      setContent(nextContent);
      setMeta(nextMeta);
      setHistoryIndex(newIndex);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    try {
      setIsSaving(true);
      
      // Update page content
      await PageService.updatePageContent(pageId!, content);
      
      // Update page meta
      await PageService.updatePageMeta(pageId!, meta);
      
      // Create a version
      await VersionService.createPageVersion(pageId!, content, meta);
      
      if (publish) {
        await PageService.publishPage(pageId!);
      }
      
      // Reload page to get latest data
      await loadPage();
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = (type: string) => {
    const newSection: PageSection = {
      id: crypto.randomUUID(),
      type,
      content: {},
      styles: {}
    };
    
    // Initialize content based on section type
    switch (type) {
      case 'text':
        newSection.content = { text: 'Add your text here' };
        break;
      case 'image':
        newSection.content = { src: '', alt: '' };
        break;
      case 'video':
        newSection.content = { src: '', autoplay: false, controls: true };
        break;
      case 'button':
        newSection.content = { text: 'Click Me', url: '#' };
        break;
      case 'form':
        newSection.content = { form_id: '' };
        break;
      case 'html':
        newSection.content = { code: '' };
        break;
    }
    
    const newContent = {
      ...content,
      sections: [...content.sections, newSection]
    };
    
    setContent(newContent);
    setSelectedSection(newSection.id);
    addToHistory(newContent, meta);
  };

  const handleUpdateSection = (id: string, updates: Partial<PageSection>) => {
    const newSections = content.sections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    
    const newContent = {
      ...content,
      sections: newSections
    };
    
    setContent(newContent);
    addToHistory(newContent, meta);
  };

  const handleRemoveSection = (id: string) => {
    const newSections = content.sections.filter(section => section.id !== id);
    
    const newContent = {
      ...content,
      sections: newSections
    };
    
    setContent(newContent);
    setSelectedSection(null);
    addToHistory(newContent, meta);
  };

  const handleDragStart = (type: string) => {
    setIsDragging(true);
    setDraggedBlockType(type);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedBlockType(null);
    
    if (draggedBlockType) {
      handleAddSection(draggedBlockType);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (!draggedBlockType) return;
    
    const newSection: PageSection = {
      id: crypto.randomUUID(),
      type: draggedBlockType,
      content: {},
      styles: {}
    };
    
    // Initialize content based on section type (same as handleAddSection)
    switch (draggedBlockType) {
      case 'text':
        newSection.content = { text: 'Add your text here' };
        break;
      case 'image':
        newSection.content = { src: '', alt: '' };
        break;
      case 'video':
        newSection.content = { src: '', autoplay: false, controls: true };
        break;
      case 'button':
        newSection.content = { text: 'Click Me', url: '#' };
        break;
      case 'form':
        newSection.content = { form_id: '' };
        break;
      case 'html':
        newSection.content = { code: '' };
        break;
    }
    
    const newSections = [...content.sections];
    newSections.splice(index, 0, newSection);
    
    const newContent = {
      ...content,
      sections: newSections
    };
    
    setContent(newContent);
    setSelectedSection(newSection.id);
    addToHistory(newContent, meta);
    
    setIsDragging(false);
    setDraggedBlockType(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderEditorPanel = () => (
    <div className="flex h-full">
      {/* Left sidebar - Blocks */}
      <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-medium mb-4">Blocks</h3>
        <div className="space-y-2">
          <div
            className="border rounded-md p-3 flex items-center gap-3 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => handleDragStart('text')}
            onDragEnd={handleDragEnd}
          >
            <Type size={16} className="text-gray-500" />
            <span className="text-sm">Text</span>
          </div>
          
          <div
            className="border rounded-md p-3 flex items-center gap-3 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => handleDragStart('image')}
            onDragEnd={handleDragEnd}
          >
            <Image size={16} className="text-gray-500" />
            <span className="text-sm">Image</span>
          </div>
          
          <div
            className="border rounded-md p-3 flex items-center gap-3 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => handleDragStart('video')}
            onDragEnd={handleDragEnd}
          >
            <Video size={16} className="text-gray-500" />
            <span className="text-sm">Video</span>
          </div>
          
          <div
            className="border rounded-md p-3 flex items-center gap-3 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => handleDragStart('button')}
            onDragEnd={handleDragEnd}
          >
            <Square size={16} className="text-gray-500" />
            <span className="text-sm">Button</span>
          </div>
          
          <div
            className="border rounded-md p-3 flex items-center gap-3 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => handleDragStart('form')}
            onDragEnd={handleDragEnd}
          >
            <Layout size={16} className="text-gray-500" />
            <span className="text-sm">Form</span>
          </div>
          
          <div
            className="border rounded-md p-3 flex items-center gap-3 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => handleDragStart('html')}
            onDragEnd={handleDragEnd}
          >
            <Code size={16} className="text-gray-500" />
            <span className="text-sm">HTML</span>
          </div>
        </div>
      </div>
      
      {/* Center - Canvas */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div 
          className="bg-white min-h-[800px] shadow-sm rounded-md mx-auto"
          style={{ maxWidth: '800px' }}
        >
          {content.sections.length === 0 ? (
            <div 
              className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-8"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 0)}
            >
              <div className="text-center">
                <Layers size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Drag and drop blocks to build your page</p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {content.sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <div 
                    className="py-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  ></div>
                  <div
                    className={`border rounded-md p-4 mb-4 ${
                      selectedSection === section.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    {/* Render section based on type */}
                    {section.type === 'text' && (
                      <div className="prose max-w-none">
                        <p>{section.content.text}</p>
                      </div>
                    )}
                    
                    {section.type === 'image' && (
                      <div className="text-center">
                        {section.content.src ? (
                          <img 
                            src={section.content.src} 
                            alt={section.content.alt || ''} 
                            className="max-w-full mx-auto"
                          />
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-8">
                            <Image size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Select an image</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {section.type === 'button' && (
                      <div className="text-center">
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-md">
                          {section.content.text || 'Button'}
                        </button>
                      </div>
                    )}
                    
                    {section.type === 'form' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                        <Layout size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Form placeholder</p>
                      </div>
                    )}
                    
                    {section.type === 'html' && (
                      <div className="border rounded-md p-4 bg-gray-50">
                        <pre className="text-xs overflow-x-auto">
                          {section.content.code || '<p>Your HTML code here</p>'}
                        </pre>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
              <div 
                className="py-2"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, content.sections.length)}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Right sidebar - Properties */}
      <div className="w-80 border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-medium mb-4">Properties</h3>
        {selectedSection ? (
          <div className="space-y-4">
            {/* Section properties based on type */}
            {(() => {
              const section = content.sections.find(s => s.id === selectedSection);
              if (!section) return null;
              
              switch (section.type) {
                case 'text':
                  return (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Content
                        </label>
                        <textarea
                          value={section.content.text || ''}
                          onChange={(e) => handleUpdateSection(section.id, {
                            content: { ...section.content, text: e.target.value }
                          })}
                          className="w-full rounded-md border-gray-300"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Size
                        </label>
                        <select
                          value={section.styles.fontSize || 'medium'}
                          onChange={(e) => handleUpdateSection(section.id, {
                            styles: { ...section.styles, fontSize: e.target.value }
                          })}
                          className="w-full rounded-md border-gray-300"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </>
                  );
                
                case 'image':
                  return (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={section.content.src || ''}
                          onChange={(e) => handleUpdateSection(section.id, {
                            content: { ...section.content, src: e.target.value }
                          })}
                          className="w-full rounded-md border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={section.content.alt || ''}
                          onChange={(e) => handleUpdateSection(section.id, {
                            content: { ...section.content, alt: e.target.value }
                          })}
                          className="w-full rounded-md border-gray-300"
                        />
                      </div>
                    </>
                  );
                
                case 'button':
                  return (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={section.content.text || ''}
                          onChange={(e) => handleUpdateSection(section.id, {
                            content: { ...section.content, text: e.target.value }
                          })}
                          className="w-full rounded-md border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="text"
                          value={section.content.url || ''}
                          onChange={(e) => handleUpdateSection(section.id, {
                            content: { ...section.content, url: e.target.value }
                          })}
                          className="w-full rounded-md border-gray-300"
                        />
                      </div>
                    </>
                  );
                
                case 'html':
                  return (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HTML Code
                      </label>
                      <textarea
                        value={section.content.code || ''}
                        onChange={(e) => handleUpdateSection(section.id, {
                          content: { ...section.content, code: e.target.value }
                        })}
                        className="w-full rounded-md border-gray-300 font-mono"
                        rows={8}
                      />
                    </div>
                  );
                
                default:
                  return (
                    <div className="text-sm text-gray-500">
                      Select a section to edit its properties
                    </div>
                  );
              }
            })()}
            
            {/* Common section controls */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleRemoveSection(selectedSection)}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                Remove Section
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Select a section to edit its properties
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/sites/${siteId}/funnels/${funnelId}`)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{page?.name || 'Page Editor'}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-md shadow-sm mr-4">
            <button
              onClick={() => setActivePanel('editor')}
              className={`px-4 py-2 text-sm font-medium ${
                activePanel === 'editor'
                  ? 'bg-primary-50 text-primary-700 border border-primary-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActivePanel('theme')}
              className={`px-4 py-2 text-sm font-medium ${
                activePanel === 'theme'
                  ? 'bg-primary-50 text-primary-700 border border-primary-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } -ml-px`}
            >
              Theme
            </button>
            <button
              onClick={() => setActivePanel('seo')}
              className={`px-4 py-2 text-sm font-medium ${
                activePanel === 'seo'
                  ? 'bg-primary-50 text-primary-700 border border-primary-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } -ml-px`}
            >
              SEO
            </button>
            <button
              onClick={() => setActivePanel('versions')}
              className={`px-4 py-2 text-sm font-medium ${
                activePanel === 'versions'
                  ? 'bg-primary-50 text-primary-700 border border-primary-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } -ml-px`}
            >
              Versions
            </button>
          </div>

          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50"
            title="Redo"
          >
            <Redo size={16} />
          </button>
          
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 ${
              previewMode ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'
            } rounded-md`}
            title="Preview"
          >
            <Eye size={16} />
          </button>
          
          <button
            onClick={() => handleSave(false)}
            className="btn btn-secondary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Save size={16} />
            <span>Save Draft</span>
          </button>
          
          <button
            onClick={() => handleSave(true)}
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={isSaving}
          >
            <Clock size={16} />
            <span>Publish</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {activePanel === 'editor' && renderEditorPanel()}
        {activePanel === 'theme' && <ThemeSettings />}
        {activePanel === 'seo' && <SEOSettings pageId={pageId!} meta={meta} onUpdate={setMeta} />}
        {activePanel === 'versions' && <VersionManager pageId={pageId!} />}
      </div>
    </div>
  );
}