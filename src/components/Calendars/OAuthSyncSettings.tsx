import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Mail, RefreshCw, Trash2, Check, AlertCircle } from 'lucide-react';

interface ConnectedCalendar {
  id: string;
  provider: 'google' | 'outlook';
  email: string;
  calendars: string[];
  last_sync: string;
  status: 'active' | 'error' | 'syncing';
  error?: string;
}

export default function OAuthSyncSettings() {
  const [connectedCalendars, setConnectedCalendars] = useState<ConnectedCalendar[]>([
    {
      id: '1',
      provider: 'google',
      email: 'john@gmail.com',
      calendars: ['Primary', 'Work'],
      last_sync: new Date().toISOString(),
      status: 'active'
    }
  ]);

  const handleConnect = (provider: 'google' | 'outlook') => {
    // Open OAuth flow in a popup
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      `/api/calendars/oauth/${provider}`,
      'Connect Calendar',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleDisconnect = async (id: string) => {
    try {
      // Implement disconnect logic
      setConnectedCalendars(prev => prev.filter(cal => cal.id !== id));
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const handleSync = async (id: string) => {
    try {
      setConnectedCalendars(prev =>
        prev.map(cal =>
          cal.id === id ? { ...cal, status: 'syncing' } : cal
        )
      );

      // Implement sync logic
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConnectedCalendars(prev =>
        prev.map(cal =>
          cal.id === id ? { ...cal, status: 'active', last_sync: new Date().toISOString() } : cal
        )
      );
    } catch (error) {
      console.error('Error syncing calendar:', error);
      setConnectedCalendars(prev =>
        prev.map(cal =>
          cal.id === id ? { ...cal, status: 'error', error: 'Sync failed' } : cal
        )
      );
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Calendar Sync</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleConnect('google')}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Mail size={16} />
              <span>Connect Google</span>
            </button>
            <button
              onClick={() => handleConnect('outlook')}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Mail size={16} />
              <span>Connect Outlook</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {connectedCalendars.map(calendar => (
            <div
              key={calendar.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Mail size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{calendar.email}</h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {calendar.provider} Calendar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSync(calendar.id)}
                    disabled={calendar.status === 'syncing'}
                    className={`p-2 rounded-full ${
                      calendar.status === 'syncing'
                        ? 'text-gray-400'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <RefreshCw
                      size={16}
                      className={calendar.status === 'syncing' ? 'animate-spin' : ''}
                    />
                  </button>
                  <button
                    onClick={() => handleDisconnect(calendar.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Synced Calendars
                </h5>
                <div className="flex flex-wrap gap-2">
                  {calendar.calendars.map(cal => (
                    <span
                      key={cal}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {cal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {calendar.status === 'active' ? (
                    <Check size={16} className="text-green-500" />
                  ) : calendar.status === 'error' ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : null}
                  <span className={`capitalize ${
                    calendar.status === 'error' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {calendar.status === 'active' ? 'Connected' : calendar.status}
                  </span>
                </div>
                <span className="text-gray-500">
                  Last synced: {new Date(calendar.last_sync).toLocaleString()}
                </span>
              </div>

              {calendar.status === 'error' && calendar.error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                  {calendar.error}
                </div>
              )}
            </div>
          ))}

          {connectedCalendars.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No calendars connected
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}