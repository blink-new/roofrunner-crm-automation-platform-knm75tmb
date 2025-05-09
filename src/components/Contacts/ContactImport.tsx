import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, ArrowRight, Check } from 'lucide-react';
import Papa from 'papaparse';
import type { ImportPreview } from '../../types/contacts';

interface ContactImportProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export default function ContactImport({ onClose, onImportComplete }: ContactImportProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [preview, setPreview] = useState<ImportPreview>({
    headers: [],
    rows: [],
    mapping: {}
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data.length > 0) {
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1, 6) as string[][];
            setPreview({
              headers,
              rows,
              mapping: {}
            });
            setStep('mapping');
          }
        },
        header: false
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleMapping = (csvColumn: string, contactField: string) => {
    setPreview(prev => ({
      ...prev,
      mapping: {
        ...prev.mapping,
        [csvColumn]: contactField
      }
    }));
  };

  const handleImport = async () => {
    try {
      // Implement the actual import logic here
      onImportComplete();
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Import Contacts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop your CSV file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supported format: CSV
              </p>
            </div>
          )}

          {step === 'mapping' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Map CSV columns to contact fields
              </h3>
              <div className="space-y-4">
                {preview.headers.map((header) => (
                  <div key={header} className="flex items-center gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        CSV Column: {header}
                      </label>
                    </div>
                    <div className="w-1/2">
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={preview.mapping[header] || ''}
                        onChange={(e) => handleMapping(header, e.target.value)}
                      >
                        <option value="">Don't import</option>
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="company">Company</option>
                        <option value="type">Type</option>
                        <option value="tags">Tags</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep('preview')}
                  className="btn btn-primary inline-flex items-center"
                >
                  Preview Import
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Preview Import (First 5 rows)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.entries(preview.mapping).map(([csvHeader, contactField]) => (
                        <th
                          key={csvHeader}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {contactField}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.entries(preview.mapping).map(([csvHeader, _], colIndex) => (
                          <td
                            key={`${rowIndex}-${colIndex}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {row[preview.headers.indexOf(csvHeader)]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setStep('mapping')}
                  className="btn btn-secondary"
                >
                  Back to Mapping
                </button>
                <button
                  onClick={handleImport}
                  className="btn btn-primary inline-flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Import Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}