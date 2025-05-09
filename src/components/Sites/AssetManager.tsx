import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Search, Filter, Plus, Trash2, Download, Copy, Image, FileText, Video, File } from 'lucide-react';
import { Card } from '../ui/card';
import { AssetService } from '../../lib/services/AssetService';

interface AssetManagerProps {
  siteId: string;
  onSelect?: (asset: any) => void;
  standalone?: boolean;
}

export default function AssetManager({ siteId, onSelect, standalone = false }: AssetManagerProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [uploads, setUploads] = useState<{ file: File; progress: number }[]>([]);

  useEffect(() => {
    loadAssets();
  }, [siteId]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await AssetService.getAssets(siteId);
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({ file, progress: 0 }));
    setUploads([...uploads, ...newUploads]);
    
    // Upload each file
    acceptedFiles.forEach(async (file) => {
      try {
        await AssetService.uploadAsset(
          siteId,
          file,
          (progress) => {
            setUploads(current => 
              current.map(upload => 
                upload.file === file ? { ...upload, progress } : upload
              )
            );
          }
        );
        
        // Refresh asset list after upload
        loadAssets();
        
        // Remove from uploads after completion
        setTimeout(() => {
          setUploads(current => current.filter(upload => upload.file !== file));
        }, 2000);
      } catch (error) {
        console.error('Error uploading file:', error);
        
        // Mark as failed
        setUploads(current => 
          current.map(upload => 
            upload.file === file ? { ...upload, progress: -1 } : upload
          )
        );
      }
    });
  }, [siteId, uploads]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const handleDeleteAsset = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await AssetService.deleteAsset(id);
        setAssets(assets.filter(asset => asset.id !== id));
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const getAssetIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type === 'application/pdf' || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || asset.type.startsWith(selectedType);
    return matchesSearch && matchesType;
  });

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assets..."
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

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <Plus size={40} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: Images, Videos, PDFs, Documents
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploading</h3>
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {getAssetIcon(upload.file.type)({ size: 20, className: 'text-gray-400' })}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm truncate">{upload.file.name}</span>
                  <span className="text-sm text-gray-500">
                    {upload.progress === -1 ? 'Failed' : `${upload.progress}%`}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      upload.progress === -1 ? 'bg-red-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${upload.progress === -1 ? 100 : upload.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 text-sm font-medium ${
            selectedType === null
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Files
        </button>
        <button
          onClick={() => setSelectedType('image/')}
          className={`px-4 py-2 text-sm font-medium ${
            selectedType === 'image/'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => setSelectedType('video/')}
          className={`px-4 py-2 text-sm font-medium ${
            selectedType === 'video/'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => setSelectedType('application/')}
          className={`px-4 py-2 text-sm font-medium ${
            selectedType === 'application/'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Documents
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No assets found matching your criteria
          </div>
        ) : (
          filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              onClick={() => onSelect && onSelect(asset)}
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                {asset.type.startsWith('image/') ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    {getAssetIcon(asset.type)({ size: 32, className: 'mx-auto text-gray-400 mb-2' })}
                    <span className="text-xs text-gray-500">{asset.type.split('/')[1]}</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(asset.url);
                    }}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAsset(asset.id);
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>Asset Manager</h1>
        <Card className="p-6">
          {renderContent()}
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Asset Manager</h2>
        {renderContent()}
      </div>
    </div>
  );
}