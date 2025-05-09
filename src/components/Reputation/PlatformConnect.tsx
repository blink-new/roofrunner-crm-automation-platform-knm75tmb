import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, ExternalLink, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { PlatformService } from '../../lib/services/PlatformService';

export default function PlatformConnect() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [platformsData, availableData] = await Promise.all([
        PlatformService.getPlatforms(),
        PlatformService.getAvailablePlatforms()
      ]);
      
      setPlatforms(platformsData);
      setAvailablePlatforms(availableData);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      setConnecting(platform);
      
      // In a real app, this would open an OAuth flow
      const result = await PlatformService.connectPlatform({
        name: platform,
        credentials: { token: 'sample-token' }
      });
      
      setPlatforms([...platforms, result]);
    } catch (error) {
      console.error('Error connecting platform:', error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (window.confirm('Are you sure you want to disconnect this platform?')) {
      try {
        await PlatformService.disconnectPlatform(id);
        setPlatforms(platforms.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error disconnecting platform:', error);
      }
    }
  };

  const handleSync = async (id: string) => {
    try {
      setSyncing(id);
      await PlatformService.syncPlatform(id);
      
      // Refresh platform data
      const platformsData = await PlatformService.getPlatforms();
      setPlatforms(platformsData);
    } catch (error) {
      console.error('Error syncing platform:', error);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Connected Platforms</h3>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : platforms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No platforms connected. Connect your first platform to start monitoring reviews.
            </div>
          ) : (
            platforms.map(platform => (
              <div key={platform.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`/icons/${platform.name.toLowerCase()}.svg`} 
                      alt={platform.name} 
                      className="w-10 h-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/icons/default-platform.svg';
                      }}
                    />
                    <div>
                      <h4 className="font-medium capitalize">{platform.name}</h4>
                      <p className="text-sm text-gray-500">
                        {platform.stats?.total_reviews || 0} reviews • {platform.stats?.average_rating?.toFixed(1) || 0} average rating
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSync(platform.id)}
                      className={`p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 ${
                        syncing === platform.id ? 'animate-spin' : ''
                      }`}
                      disabled={syncing === platform.id}
                      title="Sync reviews"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      title="Disconnect platform"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {platform.last_sync_at && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last synced: {new Date(platform.last_sync_at).toLocaleString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Available Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms
              .filter(p => !platforms.some(connected => connected.name === p.id))
              .map(platform => (
                <div key={platform.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={platform.logo_url} 
                      alt={platform.name} 
                      className="w-8 h-8"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/icons/default-platform.svg';
                      }}
                    />
                    <h4 className="font-medium">{platform.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {platform.description}
                  </p>
                  <button
                    onClick={() => handleConnect(platform.id)}
                    className="w-full btn btn-secondary inline-flex items-center justify-center gap-2"
                    disabled={connecting === platform.id}
                  >
                    {connecting === platform.id ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}