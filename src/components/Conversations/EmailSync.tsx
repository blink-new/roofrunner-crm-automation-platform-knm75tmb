import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Mail, Plus, Trash2, RefreshCw } from 'lucide-react';

interface ConnectedAccount {
  id: string;
  email: string;
  provider: string;
  lastSync: string;
  status: 'active' | 'error' | 'syncing';
}

export default function EmailSync() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      email: 'john@example.com',
      provider: 'Gmail',
      lastSync: new Date().toISOString(),
      status: 'active'
    }
  ]);

  const handleConnect = () => {
    // Implement OAuth flow
    window.open('/api/integrations/email-sync/oauth', '_blank');
  };

  const handleDisconnect = async (id: string) => {
    try {
      // Implement disconnect logic
      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Error disconnecting account:', error);
    }
  };

  const handleSync = async (id: string) => {
    try {
      // Implement sync logic
      setAccounts(accounts.map(acc =>
        acc.id === id ? { ...acc, status: 'syncing' } : acc
      ));
    } catch (error) {
      console.error('Error syncing account:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Email Integration</h3>
          <button
            onClick={handleConnect}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Connect Account</span>
          </button>
        </div>

        <div className="space-y-4">
          {accounts.map(account => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full">
                  <Mail size={20} className="text-primary-500" />
                </div>
                <div>
                  <h4 className="font-medium">{account.email}</h4>
                  <p className="text-sm text-gray-500">
                    Last synced: {new Date(account.lastSync).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSync(account.id)}
                  disabled={account.status === 'syncing'}
                  className={`p-2 rounded-full ${
                    account.status === 'syncing'
                      ? 'text-gray-400'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <RefreshCw
                    size={16}
                    className={account.status === 'syncing' ? 'animate-spin' : ''}
                  />
                </button>
                <button
                  onClick={() => handleDisconnect(account.id)}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {accounts.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No email accounts connected
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}