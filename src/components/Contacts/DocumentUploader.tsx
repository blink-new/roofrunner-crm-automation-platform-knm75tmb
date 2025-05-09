import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Download } from 'lucide-react';
import { Card } from '../ui/card';

interface Document {
  id: string;
  name: string;
  size: number;
  content_type: string;
  created_at: string;
  url?: string;
}

interface DocumentUploaderProps {
  documents: Document[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function DocumentUploader({ documents, onUpload, onDelete }: DocumentUploaderProps) {
  const [uploads, setUploads] = useState<{ file: File; progress: number }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploads(acceptedFiles.map(file => ({ file, progress: 0 })));
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Documents</h3>
        </div>

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
            Supported formats: PDF, DOC, DOCX, JPG, PNG
          </p>
        </div>

        {uploads.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Uploading</h4>
            {uploads.map((upload, index) => (
              <div key={index} className="flex items-center gap-4">
                <File size={20} className="text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm truncate">{upload.file.name}</span>
                    <span className="text-sm text-gray-500">
                      {upload.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {documents.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <File size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.size)} • {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(doc.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}