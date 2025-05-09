import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Link, Plus, Copy, Trash2, Clock, Settings } from 'lucide-react';

interface BookingLink {
  id: string;
  name: string;
  slug: string;
  type: 'permanent' | 'one-time';
  service_id?: string;
  expires_at?: string;
  created_at: string;
}

export default function BookingLinksManager() {
  const [links, setLinks] = useState<BookingLink[]>([
    {
      id: '1',
      name: 'Initial Consultation',
      slug: 'initial-consultation',
      type: 'permanent',
      service_id: '1',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Quick Meeting',
      slug: 'quick-meeting-xyz',
      type: 'one-time',
      service_id: '2',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    }
  ]);

  const baseUrl = 'https://book.example.com';

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${baseUrl}/${slug}`);
  };

  const handleCopyEmbed = (slug: string) => {
    const embedCode = `<iframe src="${baseUrl}/${slug}/embed" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
  };

  const handleDelete = async (id: string) => {
    try {
      // Implement delete logic
      setLinks(links.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Booking Links</h3>
          <div className="flex gap-2">
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <Clock size={16} />
              <span>One-Time Link</span>
            </button>
            <button className="btn btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              <span>New Link</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {links.map(link => (
            <div
              key={link.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link size={20} className="text-primary-500" />
                  <div>
                    <h4 className="font-medium">{link.name}</h4>
                    <p className="text-sm text-gray-500">
                      {link.type === 'permanent' ? 'Permanent link' : 'One-time link'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(link.slug)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="Copy link"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="Settings"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-600">
                    {baseUrl}/{link.slug}
                  </code>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyLink(link.slug)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleCopyEmbed(link.slug)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Copy Embed
                    </button>
                  </div>
                </div>
              </div>

              {link.type === 'one-time' && link.expires_at && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>
                    Expires {new Date(link.expires_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}