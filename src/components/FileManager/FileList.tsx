import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Grid, List, Search, Filter, Upload, FolderPlus,
  Image, FileText, Video, Music, File as FileIcon,
  ChevronRight, MoreVertical, Folder
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { ViewMode, File, Folder as FolderType } from '../../types/files';
import FileUploader from './FileUploader';
import FolderManager from './FolderManager';
import BulkActionToolbar from './BulkActionToolbar';
import GoogleDriveConnector from './GoogleDriveConnector';
import { FileService, FolderService, BulkActionService } from '../../lib/services/FileService';

export default function FileList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showGoogleDrive, setShowGoogleDrive] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [breadcrumbPath, setBreadcrumbPath] = useState<{label: string, path: string}[]>([
    { label: 'Home', path: '/' },
    { label: 'File Manager', path: '/file-manager', active: true }
  ]);

  useEffect(() => {
    loadFilesAndFolders();
  }, [currentFolder]);

  const loadFilesAndFolders = async () => {
    try {
      setLoading(true);
      const folderId = currentFolder?.id;
      
      const [filesData, foldersData] = await Promise.all([
        FileService.getFiles(folderId),
        FolderService.getFolders(folderId)
      ]);
      
      setFiles(filesData);
      setFolders(foldersData);
      
      // Update breadcrumb path if we're in a folder
      if (currentFolder) {
        const folderPath = await FolderService.getFolderPath(currentFolder.id);
        const newBreadcrumbs = [
          { label: 'Home', path: '/' },
          { label: 'File Manager', path: '/file-manager' },
          ...folderPath.map(folder => ({
            label: folder.name,
            path: `/file-manager/folders/${folder.id}`,
            active: folder.id === currentFolder.id
          }))
        ];
        setBreadcrumbPath(newBreadcrumbs);
      } else {
        setBreadcrumbPath([
          { label: 'Home', path: '/' },
          { label: 'File Manager', path: '/file-manager', active: true }
        ]);
      }
    } catch (error) {
      console.error('Error loading files and folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: FolderType) => {
    setCurrentFolder(folder);
    setSelectedFiles([]);
  };

  const handleFileClick = (file: File) => {
    navigate(`/file-manager/${file.id}`);
  };

  const handleSelectFile = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const handleBulkAction = async (action: 'move' | 'download' | 'delete', targetFolderId?: string) => {
    if (selectedFiles.length === 0) return;
    
    try {
      switch (action) {
        case 'move':
          if (!targetFolderId) return;
          await BulkActionService.move(selectedFiles, targetFolderId);
          break;
        case 'download':
          await BulkActionService.download(selectedFiles);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
            await BulkActionService.delete(selectedFiles);
          } else {
            return;
          }
          break;
      }
      
      // Refresh the file list
      loadFilesAndFolders();
      setSelectedFiles([]);
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await FolderService.createFolder({
        name,
        parent_id: currentFolder?.id
      });
      loadFilesAndFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadFilesAndFolders();
  };

  const getFileIcon = (type: File['type']) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'document':
        return FileText;
      default:
        return FileIcon;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={breadcrumbPath} />
          <h1 className="mt-2">File Manager</h1>
        </div>

        <div className="flex gap-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-700 border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowGoogleDrive(true)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2H2v10h10V2z" />
              <path d="M22 12h-10v10h10V12z" />
              <path d="M12 12H2v10h10V12z" />
            </svg>
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Upload</span>
          </button>

          <button
            onClick={() => {
              const folderName = prompt('Enter folder name:');
              if (folderName) handleCreateFolder(folderName);
            }}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <FolderPlus size={16} />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <BulkActionToolbar
            selectedCount={selectedFiles.length}
            onMove={(targetFolderId) => handleBulkAction('move', targetFolderId)}
            onDownload={() => handleBulkAction('download')}
            onDelete={() => handleBulkAction('delete')}
            folders={folders}
            currentFolderId={currentFolder?.id}
          />
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="aspect-square border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-500 cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <Folder size={32} className="text-gray-400" />
                <span className="text-sm text-gray-600 text-center truncate w-full">
                  {folder.name}
                </span>
              </div>
            ))}
            
            {/* Files */}
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-500 cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectFile(file.id, e.target.checked);
                    }}
                    className="rounded border-gray-300 text-primary-600"
                  />
                </div>
                
                {file.type === 'image' ? (
                  <div className="h-24 w-24 flex items-center justify-center overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : file.type === 'video' && file.thumbnail_url ? (
                  <div className="h-24 w-24 flex items-center justify-center overflow-hidden">
                    <img
                      src={file.thumbnail_url}
                      alt={file.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 flex items-center justify-center">
                    {React.createElement(getFileIcon(file.type), { size: 32, className: "text-gray-400" })}
                  </div>
                )}
                
                <span className="text-sm text-gray-600 text-center truncate w-full">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
            
            {filteredFolders.length === 0 && filteredFiles.length === 0 && !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No files or folders found
              </div>
            )}
            
            {loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-24 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Table header */}
            <div className="flex items-center px-4 py-3 bg-gray-50">
              <div className="w-8">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === files.length && files.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600"
                />
              </div>
              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Name</span>
              </div>
              <div className="w-24 text-sm font-medium text-gray-700">Size</div>
              <div className="w-32 text-sm font-medium text-gray-700">Modified</div>
              <div className="w-8"></div>
            </div>
            
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="w-8"></div>
                <div className="flex-1 flex items-center gap-3">
                  <Folder size={20} className="text-gray-400" />
                  <span className="text-sm">{folder.name}</span>
                </div>
                <div className="w-24 text-sm text-gray-500">--</div>
                <div className="w-32 text-sm text-gray-500">
                  {new Date(folder.created_at).toLocaleDateString()}
                </div>
                <div className="w-8">
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
            
            {/* Files */}
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50"
              >
                <div className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div 
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                  onClick={() => handleFileClick(file)}
                >
                  {React.createElement(getFileIcon(file.type), { size: 20, className: "text-gray-400" })}
                  <span className="text-sm">{file.name}</span>
                </div>
                <div className="w-24 text-sm text-gray-500">{formatFileSize(file.size)}</div>
                <div className="w-32 text-sm text-gray-500">
                  {new Date(file.updated_at).toLocaleDateString()}
                </div>
                <div className="w-8">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredFolders.length === 0 && filteredFiles.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No files or folders found
              </div>
            )}
            
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center px-4 py-3 animate-pulse">
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      {showUpload && (
        <FileUploader
          currentFolderId={currentFolder?.id}
          onClose={() => setShowUpload(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {showGoogleDrive && (
        <GoogleDriveConnector
          onClose={() => setShowGoogleDrive(false)}
          onImportComplete={() => {
            setShowGoogleDrive(false);
            loadFilesAndFolders();
          }}
          currentFolderId={currentFolder?.id}
        />
      )}
    </div>
  );
}