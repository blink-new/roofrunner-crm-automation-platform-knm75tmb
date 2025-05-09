import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { UploadProgress } from '../../types/files';
import { FileService } from '../../lib/services/FileService';

interface FileUploaderProps {
  currentFolderId?: string;
  onClose: () => void;
  onUploadComplete: () => void;
  maxSize?: number; // in bytes, default is 20MB
  allowedFormats?: string[];
  autoUploadToLibrary?: boolean;
}

export default function FileUploader({
  currentFolderId,
  onClose,
  onUploadComplete,
  maxSize = 20 * 1024 * 1024, // 20MB default
  allowedFormats,
  autoUploadToLibrary = false
}: FileUploaderProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

  // Fetch supported formats if not provided
  React.useEffect(() => {
    if (!allowedFormats) {
      const fetchFormats = async () => {
        try {
          const formats = await FileService.getSupportedFormats();
          setSupportedFormats(formats);
        } catch (error) {
          console.error('Error fetching supported formats:', error);
          // Fallback to common formats
          setSupportedFormats([
            'image/*',
            'video/*',
            'audio/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]);
        }
      };
      fetchFormats();
    } else {
      setSupportedFormats(allowedFormats);
    }
  }, [allowedFormats]);

  const validateFile = (file: File): boolean => {
    const errors: string[] = [];
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`File "${file.name}" exceeds the maximum size of ${formatFileSize(maxSize)}`);
    }
    
    // Check file type if we have supported formats
    if (supportedFormats.length > 0) {
      const fileType = file.type;
      const isSupported = supportedFormats.some(format => {
        if (format.endsWith('/*')) {
          // Handle wildcard formats like 'image/*'
          const formatPrefix = format.split('/')[0];
          return fileType.startsWith(`${formatPrefix}/`);
        }
        return format === fileType;
      });
      
      if (!isSupported) {
        errors.push(`File "${file.name}" has an unsupported format`);
      }
    }
    
    if (errors.length > 0) {
      setValidationErrors(prev => [...prev, ...errors]);
      return false;
    }
    
    return true;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setValidationErrors([]);
    
    // Validate files
    const validFiles = acceptedFiles.filter(validateFile);
    
    if (validFiles.length === 0) return;
    
    const newUploads = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    
    setUploads(prev => [...prev, ...newUploads]);
    
    // Auto-upload files
    validFiles.forEach(async (file) => {
      try {
        // Check if file should be auto-uploaded to library
        const shouldUploadToLibrary = autoUploadToLibrary || file.size > maxSize;
        
        if (shouldUploadToLibrary) {
          await FileService.upload(
            file,
            currentFolderId,
            (progress) => {
              setUploads(current => 
                current.map(upload => 
                  upload.file === file 
                    ? { ...upload, progress, status: 'uploading' as const } 
                    : upload
                )
              );
            }
          );
          
          // Update status to complete
          setUploads(current => 
            current.map(upload => 
              upload.file === file 
                ? { ...upload, progress: 100, status: 'complete' as const } 
                : upload
            )
          );
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        
        // Update status to error
        setUploads(current => 
          current.map(upload => 
            upload.file === file 
              ? { ...upload, status: 'error' as const, error: 'Upload failed' } 
              : upload
          )
        );
      }
    });
  }, [currentFolderId, maxSize, autoUploadToLibrary]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: supportedFormats.reduce((acc, format) => {
      if (format.includes('/')) {
        const [type, subtype] = format.split('/');
        if (!acc[format]) {
          acc[format] = [];
        }
        if (subtype !== '*') {
          acc[format].push(`.${subtype}`);
        }
      }
      return acc;
    }, {} as Record<string, string[]>)
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFinish = () => {
    // Check if all uploads are complete or failed
    const allFinished = uploads.every(upload => 
      upload.status === 'complete' || upload.status === 'error'
    );
    
    if (allFinished) {
      onUploadComplete();
    } else {
      // Ask for confirmation
      if (window.confirm('Some uploads are still in progress. Are you sure you want to close?')) {
        onUploadComplete();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Upload Files</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={40} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              {supportedFormats.length > 0 
                ? `Supported formats: ${supportedFormats.map(f => f.replace('*', '')).join(', ')}`
                : 'Loading supported formats...'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum size: {formatFileSize(maxSize)}
            </p>
          </div>

          {validationErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    The following errors occurred:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploads.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Upload Progress</h3>
              {uploads.map((upload, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm truncate">{upload.file.name}</span>
                      <span className="text-sm text-gray-500">
                        {upload.status === 'error' ? (
                          <span className="text-red-500">Error</span>
                        ) : upload.status === 'complete' ? (
                          <span className="text-green-500">Complete</span>
                        ) : (
                          `${upload.progress}%`
                        )}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          upload.status === 'error'
                            ? 'bg-red-500'
                            : upload.status === 'complete'
                            ? 'bg-green-500'
                            : 'bg-primary-500'
                        }`}
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploads(uploads.filter((_, i) => i !== index));
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleFinish}
            className="btn btn-primary"
            disabled={uploads.length === 0}
          >
            {uploads.some(u => u.status === 'pending' || u.status === 'uploading')
              ? 'Uploading...'
              : `Upload ${uploads.length > 0 ? `(${uploads.length})` : ''}`}
          </button>
        </div>
      </Card>
    </div>
  );
}