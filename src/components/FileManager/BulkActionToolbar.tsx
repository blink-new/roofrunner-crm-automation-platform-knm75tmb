import React, { useState } from 'react';
import { Folder, Download, Trash2, X } from 'lucide-react';
import { Folder as FolderType } from '../../types/files';

interface BulkActionToolbarProps {
  selectedCount: number;
  onMove: (targetFolderId: string) => void;
  onDownload: () => void;
  onDelete: () => void;
  folders: FolderType[];
  currentFolderId?: string;
}

export default function BulkActionToolbar({
  selectedCount,
  onMove,
  onDownload,
  onDelete,
  folders,
  currentFolderId
}: BulkActionToolbarProps) {
  const [showFolderSelect, setShowFolderSelect] = useState(false);

  return (
    <div className="bg-gray-50 p-4 flex items-center justify-between">
      <span className="text-sm text-gray-600">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2">
        <div className="relative">
          <button
            onClick={() => setShowFolderSelect(!showFolderSelect)}
            className="btn btn-secondary text-sm inline-flex items-center gap-1"
          >
            <Folder size={14} className="mr-1" />
            Move To
          </button>
          
          {showFolderSelect && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              {folders
                .filter(folder => folder.id !== currentFolderId)
                .map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onMove(folder.id);
                      setShowFolderSelect(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {folder.name}
                  </button>
                ))}
              {folders.filter(folder => folder.id !== currentFolderId).length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No folders available
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={onDownload}
          className="btn btn-secondary text-sm"
        >
          <Download size={14} className="mr-1" />
          Download
        </button>
        
        <button
          onClick={onDelete}
          className="btn btn-secondary text-sm text-red-600 hover:text-red-700"
        >
          <Trash2 size={14} className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}