import React, { useState, useEffect } from 'react';
import { X, Plus, Image, Video, File, Search } from 'lucide-react';
import { Card } from '../ui/card';
import { CampaignMediaService, FileService } from '../../lib/services/FileService';

interface CampaignMediaManagerProps {
  campaignId: string;
  onClose?: () => void;
  standalone?: boolean;
}

export default function CampaignMediaManager({
  campaignId,
  onClose,
  standalone = false
}: CampaignMediaManagerProps) {
  const [linkedFiles, setLinkedFiles] = useState<any[]>([]);
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilePicker, setShowFilePicker] = useState(false);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [linked, all] = await Promise.all([
        CampaignMediaService.list(campaignId),
        FileService.getFiles()
      ]);
      
      setLinkedFiles(linked);
      
      // Filter out already linked files
      const linkedIds = linked.map(file => file.id);
      setAvailableFiles(all.filter(file => !linkedIds.includes(file.id)));
    } catch (error) {
      console.error('Error loading campaign media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkFile = async (fileId: string) => {
    try {
      await CampaignMediaService.add(campaignId, fileId);
      loadData();
    } catch (error) {
      console.error('Error linking file to campaign:', error);
    }
  };

  const handleUnlinkFile = async (fileId: string) => {
    try {
      await CampaignMediaService.remove(campaignId, fileId);
      loadData();
    } catch (error) {
      console.error('Error unlinking file from campaign:', error);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAvailableFiles = availableFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Campaign Media</h3>
        <button
          onClick={() => setShowFilePicker(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Media</span>
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Linked Media</h4>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : linkedFiles.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No media linked to this campaign
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {linkedFiles.map(file => {
              const FileIcon = getFileIcon(file.type);
              return (
                <div key={file.id} className="border rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <FileIcon size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleUnlinkFile(file.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Unlink
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showFilePicker && (
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Select Media to Add</h4>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="pl-9 pr-4 py-1 text-sm border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilePicker(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {filteredAvailableFiles.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No files available to link
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
              {filteredAvailableFiles.map(file => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="border rounded-lg p-2 cursor-pointer hover:border-primary-500"
                    onClick={() => handleLinkFile(file.id)}
                  >
                    <div className="h-16 flex items-center justify-center mb-2">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <FileIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-center truncate">{file.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>Campaign Media</h1>
        <Card className="p-6">
          {renderContent()}
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Campaign Media</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}