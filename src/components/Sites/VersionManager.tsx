import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RotateCcw, Clock, User, Eye } from 'lucide-react';
import { VersionService } from '../../lib/services/VersionService';

interface VersionManagerProps {
  pageId: string;
}

export default function VersionManager({ pageId }: VersionManagerProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    loadVersions();
  }, [pageId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await VersionService.getPageVersions(pageId);
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (window.confirm('Are you sure you want to restore this version? This will overwrite your current page.')) {
      try {
        await VersionService.restorePageVersion(pageId, versionId);
        alert('Version restored successfully');
        // Reload the page to see the restored version
        window.location.reload();
      } catch (error) {
        console.error('Error restoring version:', error);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Version History</h2>
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No version history available
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`border rounded-lg p-4 ${
                  selectedVersion === version.id ? 'border-primary-500 bg-primary-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedVersion(
                  selectedVersion === version.id ? null : version.id
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(version.id);
                    }}
                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <RotateCcw size={14} />
                    <span>Restore</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{format(new Date(version.created_at), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{version.created_by || 'Unknown user'}</span>
                  </div>
                </div>

                {version.comment && (
                  <p className="mt-2 text-sm text-gray-600">
                    {version.comment}
                  </p>
                )}

                {selectedVersion === version.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-end">
                      <button
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Eye size={14} />
                        <span>Preview this version</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}