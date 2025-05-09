import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, Folder, ChevronLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { GoogleDriveService } from '../../lib/services/FileService';

interface GoogleDriveConnectorProps {
  onClose: () => void;
  onImportComplete: () => void;
  currentFolderId?: string;
}

export default function GoogleDriveConnector({
  onClose,
  onImportComplete,
  currentFolderId
}: GoogleDriveConnectorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDriveFolder, setCurrentDriveFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await GoogleDriveService.isConnected();
      setIsConnected(connected);
      if (connected) {
        loadFiles();
      }
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await GoogleDriveService.connect();
      setIsConnected(true);
      loadFiles();
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const loadFiles = async (folderId?: string) => {
    try {
      setLoading(true);
      const data = await GoogleDriveService.listFiles(folderId);
      
      // Separate files and folders
      const folders = data.filter(item => item.mimeType === 'application/vnd.google-apps.folder');
      const files = data.filter(item => item.mimeType !== 'application/vnd.google-apps.folder');
      
      setFolders(folders);
      setFiles(files);
      
      // Update folder path
      if (folderId) {
        if (!folderPath.find(f => f.id === folderId)) {
          const folderInfo = await GoogleDriveService.getFolderInfo(folderId);
          setFolderPath([...folderPath, { id: folderId, name: folderInfo.name }]);
        }
      } else {
        setFolderPath([]);
      }
      
      setCurrentDriveFolder(folderId || null);
    } catch (error) {
      console.error('Error loading Google Drive files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderId: string) => {
    loadFiles(folderId);
  };

  const handleNavigateUp = () => {
    if (folderPath.length <= 1) {
      // Go to root
      loadFiles();
    } else {
      // Go to parent folder
      const newPath = [...folderPath];
      newPath.pop();
      const parentId = newPath.length > 0 ? newPath[newPath.length - 1].id : undefined;
      loadFiles(parentId);
    }
  };

  const handleSelectFile = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleImportFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      setImporting(true);
      await GoogleDriveService.importFiles(selectedFiles, currentFolderId);
      onImportComplete();
    } catch (error) {
      console.error('Error importing files from Google Drive:', error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Google Drive</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 48 48" 
                width="64" 
                height="64"
                className="mb-4"
              >
                <path fill="#FFC107" d="M17 6l8 14H9z"/>
                <path fill="#1976D2" d="M9 20l8 14-14-8z"/>
                <path fill="#4CAF50" d="M33 20l-8 14 14-8z"/>
                <path fill="#E53935" d="M25 34l-8-14h16z"/>
                <path fill="#FF3D00" d="M25 6l8 14H33L25 6z"/>
              </svg>
              <h3 className="text-lg font-medium mb-4">Connect to Google Drive</h3>
              <button
                onClick={handleConnect}
                className="btn btn-primary"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentDriveFolder && (
                    <button
                      onClick={handleNavigateUp}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <div className="flex items-center gap-1">
                    {folderPath.map((folder, index) => (
                      <React.Fragment key={folder.id}>
                        {index > 0 && <span className="text-gray-400">/</span>}
                        <button
                          onClick={() => loadFiles(folder.id)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {folder.name}
                        </button>
                      </React.Fragment>
                    ))}
                    {folderPath.length === 0 && (
                      <span className="text-sm font-medium">My Drive</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => loadFiles(currentDriveFolder || undefined)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {folders.length === 0 && files.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      This folder is empty
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Folders */}
                      {folders.map(folder => (
                        <div
                          key={folder.id}
                          className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                          onClick={() => handleFolderClick(folder.id)}
                        >
                          <Folder size={32} className="text-gray-400 mb-2" />
                          <span className="text-sm text-center truncate w-full">{folder.name}</span>
                        </div>
                      ))}
                      
                      {/* Files */}
                      {files.map(file => (
                        <div
                          key={file.id}
                          className="border rounded-lg p-4 flex flex-col items-center justify-center relative"
                        >
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600"
                            />
                          </div>
                          
                          {file.thumbnailLink ? (
                            <img
                              src={file.thumbnailLink}
                              alt={file.name}
                              className="h-12 w-12 object-contain mb-2"
                            />
                          ) : (
                            <div className="h-12 w-12 flex items-center justify-center mb-2">
                              {file.mimeType.startsWith('image/') ? (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                  <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                              ) : file.mimeType.startsWith('video/') ? (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                  <line x1="7" y1="2" x2="7" y2="22"></line>
                                  <line x1="17" y1="2" x2="17" y2="22"></line>
                                  <line x1="2" y1="12" x2="22" y2="12"></line>
                                  <line x1="2" y1="7" x2="7" y2="7"></line>
                                  <line x1="2" y1="17" x2="7" y2="17"></line>
                                  <line x1="17" y1="17" x2="22" y2="17"></line>
                                  <line x1="17" y1="7" x2="22" y2="7"></line>
                                </svg>
                              ) : file.mimeType.startsWith('application/pdf') ? (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                              ) : (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                              )}
                            </div>
                          )}
                          
                          <span className="text-sm text-center truncate w-full">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleImportFiles}
            className="btn btn-primary"
            disabled={selectedFiles.length === 0 || importing}
          >
            {importing ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Import Selected ({selectedFiles.length})
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}