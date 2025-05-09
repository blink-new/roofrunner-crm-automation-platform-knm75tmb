import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Folder, FolderPlus, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { WorkflowFolder } from '../../types/automations';
import { FolderService } from '../../lib/services/FolderService';

interface FolderManagerProps {
  selectedFolderId?: string;
  onSelectFolder: (folderId?: string) => void;
}

export default function FolderManager({
  selectedFolderId,
  onSelectFolder
}: FolderManagerProps) {
  const [folders, setFolders] = useState<WorkflowFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const data = await FolderService.getFolders();
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await FolderService.createFolder({
        name: newFolderName,
        parent_id: undefined
      });
      setNewFolderName('');
      setShowNewFolderInput(false);
      loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleUpdateFolder = async (id: string, name: string) => {
    try {
      await FolderService.updateFolder(id, { name });
      setEditingFolder(null);
      loadFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      try {
        await FolderService.deleteFolder(id);
        if (selectedFolderId === id) {
          onSelectFolder(undefined);
        }
        loadFolders();
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  // Build folder tree
  const rootFolders = folders.filter(f => !f.parent_id);
  
  const renderFolder = (folder: WorkflowFolder) => {
    const childFolders = folders.filter(f => f.parent_id === folder.id);
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = selectedFolderId === folder.id;
    
    return (
      <div key={folder.id}>
        <div className="flex items-center">
          {childFolders.length > 0 ? (
            <button
              onClick={() => toggleFolder(folder.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6"></div>
          )}
          
          <div
            className={`flex-1 flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
              isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectFolder(folder.id)}
          >
            <Folder size={16} className={isSelected ? 'text-primary-500' : 'text-gray-400'} />
            
            {editingFolder === folder.id ? (
              <input
                type="text"
                value={folder.name}
                onChange={(e) => {
                  const updatedFolders = folders.map(f =>
                    f.id === folder.id ? { ...f, name: e.target.value } : f
                  );
                  setFolders(updatedFolders);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateFolder(folder.id, folder.name);
                  } else if (e.key === 'Escape') {
                    setEditingFolder(null);
                    loadFolders(); // Reset to original name
                  }
                }}
                onBlur={() => {
                  handleUpdateFolder(folder.id, folder.name);
                }}
                className="flex-1 text-sm border-none focus:ring-0 bg-transparent p-0"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-sm">{folder.name}</span>
            )}
            
            <div className="flex opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingFolder(folder.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {isExpanded && childFolders.length > 0 && (
          <div className="ml-6 mt-1 space-y-1">
            {childFolders.map(childFolder => renderFolder(childFolder))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Folders</h3>
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <FolderPlus size={16} />
          </button>
        </div>

        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
            !selectedFolderId ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectFolder(undefined)}
        >
          <Folder size={16} className={!selectedFolderId ? 'text-primary-500' : 'text-gray-400'} />
          <span className="text-sm">All Workflows</span>
        </div>

        {showNewFolderInput && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className="flex-1 text-sm rounded-md border-gray-300"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                } else if (e.key === 'Escape') {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }
              }}
            />
            <button
              onClick={handleCreateFolder}
              className="text-sm text-primary-600 hover:text-primary-700"
              disabled={!newFolderName.trim()}
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowNewFolderInput(false);
                setNewFolderName('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="space-y-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                <div className="w-6 h-6"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : rootFolders.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">
              No folders found
            </div>
          ) : (
            rootFolders.map(folder => renderFolder(folder))
          )}
        </div>
      </div>
    </Card>
  );
}