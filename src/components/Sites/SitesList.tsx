import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe, Settings, BarChart2 } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Site } from '../../types/sites';

export default function SitesList() {
  const navigate = useNavigate();
  const [sites] = useState<Site[]>([
    {
      id: '1',
      name: 'Main Landing Page',
      description: 'Primary marketing site',
      domain: 'www.example.com',
      ssl_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Sites', path: '/sites', active: true }
            ]}
          />
          <h1 className="mt-2">Sites & Funnels</h1>
        </div>

        <button
          onClick={() => navigate('/sites/new')}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Site</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <Card
            key={site.id}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-primary-500" />
                  <h3 className="font-medium">{site.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/sites/${site.id}/analytics`)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/sites/${site.id}/settings`)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{site.description}</p>

              {site.domain && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Globe size={14} />
                  <span>{site.domain}</span>
                  {site.ssl_enabled && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      SSL
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/sites/${site.id}`)}
                  className="btn btn-secondary text-sm flex-1"
                >
                  Edit Site
                </button>
                <button
                  onClick={() => navigate(`/sites/${site.id}/funnels/new`)}
                  className="btn btn-primary text-sm flex-1"
                >
                  Add Funnel
                </button>
              </div>
            </div>
          </Card>
        ))}

        <Card
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => navigate('/sites/new')}
        >
          <div className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <h3 className="font-medium text-gray-900">Create New Site</h3>
            <p className="text-sm text-gray-500 mt-1">
              Start with a blank canvas or use a template
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}