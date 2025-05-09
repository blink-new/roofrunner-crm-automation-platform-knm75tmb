import React from 'react';
import { format } from 'date-fns';
import { Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../ui/card';

interface Subscription {
  id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'past_due';
  amount: number;
  currency: string;
  billing_period: string;
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
  cancel_at_period_end: boolean;
}

interface SubscriptionHistoryProps {
  subscriptions: Subscription[];
}

export default function SubscriptionHistory({ subscriptions }: SubscriptionHistoryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50';
      case 'past_due':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Subscriptions</h3>
        </div>

        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No subscriptions found</p>
          ) : (
            subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{subscription.plan_name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(subscription.amount, subscription.currency)} / {subscription.billing_period}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                    {subscription.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Started</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span>{format(new Date(subscription.start_date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {subscription.next_billing_date && (
                    <div>
                      <span className="text-gray-500">Next billing</span>
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign size={14} className="text-gray-400" />
                        <span>{format(new Date(subscription.next_billing_date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {subscription.status === 'active' && subscription.cancel_at_period_end && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <XCircle size={14} className="text-gray-400" />
                    <span>Will cancel at end of current period</span>
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