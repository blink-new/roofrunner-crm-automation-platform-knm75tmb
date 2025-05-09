import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, AlertTriangle, RefreshCw, Globe, Shield } from 'lucide-react';
import { Card } from '../ui/card';
import { DomainService } from '../../lib/services/DomainService';

interface DomainManagerProps {
  siteId: string;
}

export default function DomainManager({ siteId }: DomainManagerProps) {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [domainStatuses, setDomainStatuses] = useState<Record<string, any>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isChecking, setIsChecking] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDomains();
  }, [siteId]);

  const loadDomains = async () => {
    try {
      setLoading(true);
      const data = await DomainService.getDomains(siteId);
      setDomains(data);
      
      // Load status for each domain
      const statuses: Record<string, any> = {};
      for (const domain of data) {
        try {
          const status = await DomainService.getDomainStatus(domain.id);
          statuses[domain.id] = status;
        } catch (error) {
          console.error(`Error loading status for domain ${domain.id}:`, error);
          statuses[domain.id] = { status: 'failed', error: 'Failed to load status' };
        }
      }
      
      setDomainStatuses(statuses);
    } catch (error) {
      console.error('Error loading domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    
    try {
      setIsAdding(true);
      const domain = await DomainService.addDomain({
        site_id: siteId,
        domain: newDomain,
        primary: isPrimary
      });
      
      setDomains([...domains, domain]);
      setNewDomain('');
      setIsPrimary(false);
      
      // Get initial status
      const status = await DomainService.getDomainStatus(domain.id);
      setDomainStatuses({
        ...domainStatuses,
        [domain.id]: status
      });
    } catch (error) {
      console.error('Error adding domain:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveDomain = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this domain?')) {
      try {
        await DomainService.removeDomain(id);
        setDomains(domains.filter(domain => domain.id !== id));
        
        // Remove status
        const newStatuses = { ...domainStatuses };
        delete newStatuses[id];
        setDomainStatuses(newStatuses);
      } catch (error) {
        console.error('Error removing domain:', error);
      }
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await DomainService.updateDomain(id, { primary: true });
      setDomains(domains.map(domain => ({
        ...domain,
        primary: domain.id === id
      })));
    } catch (error) {
      console.error('Error setting primary domain:', error);
    }
  };

  const handleCheckStatus = async (id: string) => {
    try {
      setIsChecking({ ...isChecking, [id]: true });
      const status = await DomainService.getDomainStatus(id);
      setDomainStatuses({
        ...domainStatuses,
        [id]: status
      });
    } catch (error) {
      console.error('Error checking domain status:', error);
    } finally {
      setIsChecking({ ...isChecking, [id]: false });
    }
  };

  const handleProvisionSSL = async (id: string) => {
    try {
      await DomainService.provisionSSL(id);
      // Refresh status
      handleCheckStatus(id);
    } catch (error) {
      console.error('Error provisioning SSL:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Domain Management</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="rounded-md border-gray-300"
              placeholder="example.com"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 mr-2"
              />
              <span className="text-sm">Primary</span>
            </label>
            <button
              onClick={handleAddDomain}
              className="btn btn-primary inline-flex items-center gap-2"
              disabled={isAdding || !newDomain.trim()}
            >
              <Plus size={16} />
              <span>{isAdding ? 'Adding...' : 'Add Domain'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : domains.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No domains added yet. Add your first domain to get started.
            </div>
          ) : (
            domains.map(domain => {
              const status = domainStatuses[domain.id];
              return (
                <div key={domain.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-primary-500" />
                      <div>
                        <h4 className="font-medium">{domain.domain}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {domain.primary && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Primary
                            </span>
                          )}
                          {status && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(status.status)}`}>
                              {status.status}
                            </span>
                          )}
                          {status?.ssl_status && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(status.ssl_status)}`}>
                              SSL: {status.ssl_status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!domain.primary && (
                        <button
                          onClick={() => handleSetPrimary(domain.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          title="Set as primary"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleCheckStatus(domain.id)}
                        className={`p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 ${
                          isChecking[domain.id] ? 'animate-spin' : ''
                        }`}
                        title="Check status"
                        disabled={isChecking[domain.id]}
                      >
                        <RefreshCw size={16} />
                      </button>
                      {status?.ssl_status === 'failed' && (
                        <button
                          onClick={() => handleProvisionSSL(domain.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          title="Provision SSL"
                        >
                          <Shield size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveDomain(domain.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        title="Remove domain"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {status?.dns_records && status.dns_records.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium mb-2">DNS Configuration</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {status.dns_records.map((record: any, index: number) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{record.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{record.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-xs">{record.value}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    record.status === 'valid' ? 'bg-green-100 text-green-800' :
                                    record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {status?.error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5" />
                      <div>
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{status.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}