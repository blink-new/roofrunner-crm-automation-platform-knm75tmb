import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Plus, Trash2, Check, AlertCircle, CreditCard, DollarSign, Wallet } from 'lucide-react';
import { PaymentMethodService } from '../../lib/services/PaymentMethodService';

export default function PaymentMethodSettings() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await PaymentMethodService.list();
      setPaymentMethods(methods);
    } catch (err) {
      console.error('Error loading payment methods:', err);
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedProvider) return;
    
    try {
      setConnecting(selectedProvider);
      setError(null);
      
      await PaymentMethodService.connect(selectedProvider, credentials);
      setShowConnectForm(false);
      setSelectedProvider('');
      setCredentials({});
      loadPaymentMethods();
    } catch (err) {
      console.error('Error connecting payment method:', err);
      setError('Failed to connect payment method');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!window.confirm('Are you sure you want to disconnect this payment method?')) {
      return;
    }
    
    try {
      await PaymentMethodService.disconnect(id);
      loadPaymentMethods();
    } catch (err) {
      console.error('Error disconnecting payment method:', err);
      setError('Failed to disconnect payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await PaymentMethodService.update(id, { is_default: true });
      loadPaymentMethods();
    } catch (err) {
      console.error('Error setting default payment method:', err);
      setError('Failed to set default payment method');
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return <CreditCard className="text-purple-500" />;
      case 'paypal':
        return <DollarSign className="text-blue-500" />;
      case 'authnet':
        return <CreditCard className="text-red-500" />;
      case 'nmi':
        return <CreditCard className="text-green-500" />;
      case 'ach':
        return <Wallet className="text-gray-500" />;
      default:
        return <CreditCard className="text-gray-500" />;
    }
  };

  const renderConnectForm = () => {
    const getFields = () => {
      switch (selectedProvider) {
        case 'stripe':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={credentials.api_key || ''}
                  onChange={(e) => setCredentials({ ...credentials, api_key: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="sk_test_..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={credentials.publishable_key || ''}
                  onChange={(e) => setCredentials({ ...credentials, publishable_key: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                  placeholder="pk_test_..."
                />
              </div>
            </>
          );
        case 'paypal':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={credentials.client_id || ''}
                  onChange={(e) => setCredentials({ ...credentials, client_id: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={credentials.client_secret || ''}
                  onChange={(e) => setCredentials({ ...credentials, client_secret: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  value={credentials.environment || 'sandbox'}
                  onChange={(e) => setCredentials({ ...credentials, environment: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </>
          );
        case 'authnet':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Login ID
                </label>
                <input
                  type="text"
                  value={credentials.api_login_id || ''}
                  onChange={(e) => setCredentials({ ...credentials, api_login_id: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Key
                </label>
                <input
                  type="password"
                  value={credentials.transaction_key || ''}
                  onChange={(e) => setCredentials({ ...credentials, transaction_key: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  value={credentials.environment || 'sandbox'}
                  onChange={(e) => setCredentials({ ...credentials, environment: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </>
          );
        case 'nmi':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gateway ID
                </label>
                <input
                  type="text"
                  value={credentials.gateway_id || ''}
                  onChange={(e) => setCredentials({ ...credentials, gateway_id: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={credentials.api_key || ''}
                  onChange={(e) => setCredentials({ ...credentials, api_key: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
            </>
          );
        case 'ach':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  value={credentials.provider || 'plaid'}
                  onChange={(e) => setCredentials({ ...credentials, provider: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="plaid">Plaid</option>
                  <option value="stripe_ach">Stripe ACH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={credentials.api_key || ''}
                  onChange={(e) => setCredentials({ ...credentials, api_key: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-4">Connect Payment Method</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setCredentials({});
              }}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">Select a provider</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="authnet">Authorize.net</option>
              <option value="nmi">NMI</option>
              <option value="ach">ACH</option>
            </select>
          </div>

          {selectedProvider && getFields()}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowConnectForm(false);
                setSelectedProvider('');
                setCredentials({});
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              className="btn btn-primary"
              disabled={!selectedProvider || connecting === selectedProvider}
            >
              {connecting === selectedProvider ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <button
            onClick={() => setShowConnectForm(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Connect Method</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {showConnectForm && renderConnectForm()}

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
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment methods connected. Click "Connect Method" to add one.
            </div>
          ) : (
            paymentMethods.map(method => (
              <div key={method.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getProviderIcon(method.provider)}
                    </div>
                    <div>
                      <h4 className="font-medium capitalize">{method.provider}</h4>
                      <p className="text-sm text-gray-500">
                        {method.is_default && (
                          <span className="text-green-600 font-medium">Default • </span>
                        )}
                        {method.description || `Connected on ${new Date(method.created_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        title="Set as default"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDisconnect(method.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      title="Disconnect"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {method.status === 'error' && method.error_message && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                    {method.error_message}
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