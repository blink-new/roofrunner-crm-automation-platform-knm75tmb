import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Folder, FolderPlus, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Folder as FolderType } from '../../types/files';
import { FolderService } from '../../lib/services/FileService';

interface FolderManagerProps {
  onSelectFolder: (folder: FolderType) => void;
  currentFolderId?: string;
}

export default function FolderManager({
  onSelectFolder,
  currentFolderId
}: FolderManagerProps) {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const data = await FolderService.getAllFolders();
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (parentId?: string) => {
    const name = prompt('Enter folder name:');
    if (!name) return;
    
    try {
      await FolderService.createFolder({
        name,
        parent_id: parentId
      });
      loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleUpdateFolder = async (id: string) => {
    if (!editName.trim()) {
      setEditingFolder(null);
      return;
    }
    
    try {
      await FolderService.updateFolder(id, { name: editName });
      setEditingFolder(null);
      loadFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this folder? All files inside will be moved to the parent folder.')) {
      return;
    }
    
    try {
      await FolderService.deleteFolder(id);
      loadFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
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
  const buildFolderTree = (folders: FolderType[], parentId?: string): FolderType[] => {
    return folders
      .filter(folder => folder.parent_id === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const renderFolder = (folder: FolderType, depth = 0) => {
    const childFolders = buildFolderTree(folders, folder.id);
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = currentFolderId === folder.id;
    
    return (
      <div key={folder.id} style={{ marginLeft: `${depth * 16}px` }}>
        <div className="flex items-center group">
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
            onClick={() => onSelectFolder(folder)}
          >
            <Folder size={16} className={isSelected ? 'text-primary-500' : 'text-gray-400'} />
            
            {editingFolder === folder.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateFolder(folder.id);
                  } else if (e.key === 'Escape') {
                    setEditingFolder(null);
                  }
                }}
                onBlur={() => handleUpdateFolder(folder.id)}
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
                  setEditName(folder.name);
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFolder(folder.id);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <FolderPlus size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {isExpanded && childFolders.length > 0 && (
          <div className="mt-1 space-y-1">
            {childFolders.map(childFolder => renderFolder(childFolder, depth + 1))}
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
            onClick={() => handleCreateFolder()}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <FolderPlus size={16} />
          </button>
        </div>

        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
            !currentFolderId ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectFolder({ id: '', name: 'All Files', created_at: '' })}
        >
          <Folder size={16} className={!currentFolderId ? 'text-primary-500' : 'text-gray-400'} />
          <span className="text-sm">All Files</span>
        </div>

        <div className="space-y-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                <div className="w-6 h-6"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : folders.filter(f => !f.parent_id).length === 0 ? (
            <div className="text-sm text-gray-500 py-2">
              No folders found
            </div>
          ) : (
            buildFolderTree(folders).map(folder => renderFolder(folder))
          )}
        </div>
      </div>
    </Card>
  );
}