import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Trash2, Plus, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { QRCodeService } from '../../lib/services/QRCodeService';

interface QRCodeManagerProps {
  standalone?: boolean;
}

export default function QRCodeManager({ standalone = false }: QRCodeManagerProps) {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newQrCode, setNewQrCode] = useState({
    name: '',
    platform: 'google',
    settings: {
      size: 300,
      color: '#000000',
      logo: true
    }
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadQrCodes();
  }, []);

  const loadQrCodes = async () => {
    try {
      setLoading(true);
      const data = await QRCodeService.getReviewQRCodes();
      setQrCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQrCode = async () => {
    try {
      // Generate QR code
      const qrResult = await QRCodeService.generateQRCode({
        content: `https://g.page/r/${newQrCode.platform === 'google' ? 'review' : newQrCode.platform}`,
        size: newQrCode.settings.size,
        color: newQrCode.settings.color,
        logo: newQrCode.settings.logo ? 'google' : undefined
      });
      
      // Create QR code record
      const qrCode = await QRCodeService.createReviewQRCode({
        ...newQrCode,
        url: qrResult.url
      });
      
      setQrCodes([...qrCodes, qrCode]);
      setShowNewForm(false);
      setNewQrCode({
        name: '',
        platform: 'google',
        settings: {
          size: 300,
          color: '#000000',
          logo: true
        }
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error creating QR code:', error);
    }
  };

  const handleDeleteQrCode = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      try {
        await QRCodeService.deleteReviewQRCode(id);
        setQrCodes(qrCodes.filter(qr => qr.id !== id));
      } catch (error) {
        console.error('Error deleting QR code:', error);
      }
    }
  };

  const handleGeneratePreview = async () => {
    try {
      const result = await QRCodeService.generateQRCode({
        content: `https://g.page/r/${newQrCode.platform === 'google' ? 'review' : newQrCode.platform}`,
        size: newQrCode.settings.size,
        color: newQrCode.settings.color,
        logo: newQrCode.settings.logo ? 'google' : undefined
      });
      
      setPreviewUrl(result.url);
    } catch (error) {
      console.error('Error generating QR code preview:', error);
    }
  };

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">QR Codes for Reviews</h3>
        <button
          onClick={() => setShowNewForm(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Create QR Code</span>
        </button>
      </div>

      {showNewForm && (
        <Card className="p-4 border-2 border-primary-100">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={newQrCode.name}
                  onChange={(e) => setNewQrCode({ ...newQrCode, name: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="e.g., Store Front QR Code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Platform
                </label>
                <select
                  value={newQrCode.platform}
                  onChange={(e) => setNewQrCode({ ...newQrCode, platform: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                  <option value="yelp">Yelp</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Size
                </label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  step="50"
                  value={newQrCode.settings.size}
                  onChange={(e) => setNewQrCode({
                    ...newQrCode,
                    settings: {
                      ...newQrCode.settings,
                      size: parseInt(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Small</span>
                  <span>{newQrCode.settings.size}px</span>
                  <span>Large</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newQrCode.settings.color}
                    onChange={(e) => setNewQrCode({
                      ...newQrCode,
                      settings: {
                        ...newQrCode.settings,
                        color: e.target.value
                      }
                    })}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <input
                    type="text"
                    value={newQrCode.settings.color}
                    onChange={(e) => setNewQrCode({
                      ...newQrCode,
                      settings: {
                        ...newQrCode.settings,
                        color: e.target.value
                      }
                    })}
                    className="flex-1 rounded-md border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newQrCode.settings.logo}
                    onChange={(e) => setNewQrCode({
                      ...newQrCode,
                      settings: {
                        ...newQrCode.settings,
                        logo: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Include platform logo
                  </span>
                </label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePreview}
                  className="btn btn-secondary"
                  disabled={!newQrCode.name}
                >
                  Preview
                </button>
                <button
                  onClick={handleCreateQrCode}
                  className="btn btn-primary"
                  disabled={!newQrCode.name}
                >
                  Create QR Code
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center border rounded-lg p-4">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="QR Code Preview" 
                  className="max-w-full max-h-64"
                />
              ) : (
                <div className="text-center">
                  <QrCode size={64} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </Card>
          ))
        ) : qrCodes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No QR codes found. Create your first QR code to get started.
          </div>
        ) : (
          qrCodes.map(qrCode => (
            <Card key={qrCode.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{qrCode.name}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(qrCode.url, qrCode.name)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Download QR code"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(qrCode.url)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteQrCode(qrCode.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Delete QR code"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center mb-4">
                <img 
                  src={qrCode.url} 
                  alt={qrCode.name} 
                  className="max-w-full max-h-48"
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{qrCode.platform}</span>
                <span>{new Date(qrCode.created_at).toLocaleDateString()}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <h1>QR Code Manager</h1>
        <Card className="p-6">
          {renderContent()}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}