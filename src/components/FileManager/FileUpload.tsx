import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { UploadProgress } from '../../types/files';

interface FileUploadProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function FileUpload({ onClose, onUploadComplete }: FileUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    setUploads(prev => [...prev, ...newUploads]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

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
              Supported formats: Images, Videos, Documents, Audio
            </p>
          </div>

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
            onClick={onUploadComplete}
            className="btn btn-primary"
            disabled={uploads.length === 0}
          >
            Upload {uploads.length > 0 && `(${uploads.length})`}
          </button>
        </div>
      </Card>
    </div>
  );
}