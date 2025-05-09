import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ChevronLeft, Search, Filter, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Funnel } from '../../types/sites';
import { FunnelService } from '../../lib/services/FunnelService';
import { SiteService } from '../../lib/services/SiteService';

export default function FunnelList() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [siteId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const funnelData = await FunnelService.getFunnels(siteId);
      setFunnels(funnelData);

      if (siteId) {
        const siteData = await SiteService.getSite(siteId);
        setSite(siteData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunnels = funnels.filter(funnel => 
    funnel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (funnel.description && funnel.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Websites & Funnels', path: '/sites' },
              ...(site ? [{ label: site.name, path: `/sites/${siteId}` }] : []),
              { label: 'Funnels', path: `/sites/${siteId}/funnels`, active: true }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate(siteId ? `/sites/${siteId}` : '/sites')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <h1>Funnels {site ? `for ${site.name}` : ''}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search funnels..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => navigate(`/sites/${siteId}/funnels/new`)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Funnel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="hover:shadow-lg transition-shadow animate-pulse"
            >
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </Card>
          ))
        ) : filteredFunnels.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchQuery ? 'No funnels found matching your search.' : 'No funnels found. Create your first funnel to get started.'}
          </div>
        ) : (
          filteredFunnels.map((funnel) => (
            <Card
              key={funnel.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-medium mb-2">{funnel.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{funnel.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{funnel.pages?.length || 0} pages</span>
                  <span>•</span>
                  <span>Created {new Date(funnel.created_at).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => navigate(`/sites/${siteId}/funnels/${funnel.id}`)}
                  className="btn btn-primary text-sm w-full inline-flex items-center justify-center gap-2"
                >
                  <span>Edit Funnel</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </Card>
          ))
        )}

        <Card
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => navigate(`/sites/${siteId}/funnels/new`)}
        >
          <div className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <h3 className="font-medium text-gray-900">Create New Funnel</h3>
            <p className="text-sm text-gray-500 mt-1">
              Build a conversion-optimized funnel
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}