import React, { useState } from 'react';
import { Card } from '../ui/card';
import { X, Save } from 'lucide-react';

interface EmbedWidgetProps {
  onClose: () => void;
  onSave: (config: { url: string; width: number; height: number }) => void;
}

export default function EmbedWidget({ onClose, onSave }: EmbedWidgetProps) {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ url, width, height });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Embed Content</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL to Embed
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-md border-gray-300"
                placeholder="https://example.com/embed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300"
                  min="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300"
                  min="100"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div
                className="border border-gray-200 rounded-md overflow-hidden"
                style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
              >
                {url && (
                  <iframe
                    src={url}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Embedded content"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            >
              <Save size={16} />
              <span>Save Widget</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}