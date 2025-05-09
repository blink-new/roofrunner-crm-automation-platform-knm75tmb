import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RotateCcw, Clock, User, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { WorkflowVersion } from '../../types/automations';
import { VersionService } from '../../lib/services/VersionService';

interface VersionHistoryPanelProps {
  workflowId: string;
  currentVersion: number;
  onRollback: (version: number) => Promise<void>;
  onClose: () => void;
}

export default function VersionHistoryPanel({
  workflowId,
  currentVersion,
  onRollback,
  onClose
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<WorkflowVersion | null>(null);

  useEffect(() => {
    loadVersions();
  }, [workflowId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await VersionService.getVersions(workflowId);
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: number) => {
    try {
      await onRollback(version);
      onClose();
    } catch (error) {
      console.error('Error rolling back to version:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Version History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : versions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No version history available
            </div>
          ) : (
            versions.map(version => (
              <div
                key={version.id}
                className={`border rounded-lg p-4 ${
                  version.version === currentVersion
                    ? 'border-primary-500 bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Version {version.version}</span>
                    {version.version === currentVersion && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Current
                      </span>
                    )}
                  </div>
                  {version.version !== currentVersion && (
                    <button
                      onClick={() => handleRollback(version.version)}
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <RotateCcw size={14} />
                      <span>Rollback</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{version.created_by}</span>
                  </div>
                </div>

                {version.comment && (
                  <p className="mt-2 text-sm text-gray-600">
                    {version.comment}
                  </p>
                )}

                <div className="mt-2 text-sm">
                  <button
                    onClick={() => setSelectedVersion(
                      selectedVersion?.id === version.id ? null : version
                    )}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {selectedVersion?.id === version.id ? 'Hide details' : 'View details'}
                  </button>
                </div>

                {selectedVersion?.id === version.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Nodes</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {version.nodes.map(node => (
                            <li key={node.id}>
                              {node.type}: {node.data.name || node.id}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Connections</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {version.edges.map(edge => (
                            <li key={edge.id} className="flex items-center gap-1">
                              <span>{edge.source.substring(0, 6)}</span>
                              <ArrowRight size={12} />
                              <span>{edge.target.substring(0, 6)}</span>
                              {edge.label && <span className="text-gray-400">({edge.label})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}