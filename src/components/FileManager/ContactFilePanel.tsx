import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Trash2, File, Image, Video, FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { ContactFileService } from '../../lib/services/FileService';

interface ContactFilePanelProps {
  contactId: string;
}

export default function ContactFilePanel({ contactId }: ContactFilePanelProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadFiles();
  }, [contactId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await ContactFileService.list(contactId);
      setFiles(data);
    } catch (error) {
      console.error('Error loading contact files:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    try {
      setUploading(true);
      
      // Initialize progress tracking
      const initialProgress = acceptedFiles.reduce((acc, file) => {
        acc[file.name] = 0;
        return acc;
      }, {} as Record<string, number>);
      
      setUploadProgress(initialProgress);
      
      // Upload each file
      for (const file of acceptedFiles) {
        await ContactFileService.upload(
          contactId,
          file,
          (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          }
        );
      }
      
      // Refresh file list
      loadFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [contactId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      await ContactFileService.delete(id);
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return Image;
    if (contentType.startsWith('video/')) return Video;
    if (contentType === 'application/pdf' || contentType.includes('document')) return FileText;
    return File;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Documents</h3>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: Images, PDFs, Documents
          </p>
        </div>

        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploading</h4>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 truncate">{fileName}</span>
                    <span className="text-xs text-gray-600">{progress}%</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Documents</h4>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : files.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No documents uploaded yet
            </div>
          ) : (
            files.map((file) => {
              const FileIcon = getFileIcon(file.content_type);
              return (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileIcon size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}