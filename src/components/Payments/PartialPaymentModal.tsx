import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { Card } from '../ui/card';
import type { Invoice } from '../../types/invoicing';

interface PartialPaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSave: (amount: number) => Promise<void>;
}

export default function PartialPaymentModal({
  invoice,
  onClose,
  onSave
}: PartialPaymentModalProps) {
  const [amount, setAmount] = useState<number>(invoice.total);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach' | 'wallet'>('card');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = invoice.total - totalPaid;

  const handleSubmit = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (amount > remainingAmount) {
      setError(`Amount cannot exceed the remaining balance of ${formatCurrency(remainingAmount)}`);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(amount);
    } catch (err) {
      console.error('Error recording payment:', err);
      setError('Failed to record payment');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency || 'USD'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Record Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice
            </label>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="font-medium">#{invoice.number}</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {invoice.status === 'partial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remaining Balance
              </label>
              <div className="p-3 bg-gray-50 rounded-md font-medium">
                {formatCurrency(remainingAmount)}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-7 pr-12 rounded-md border-gray-300"
                placeholder="0.00"
                min="0"
                max={remainingAmount}
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{invoice.currency || 'USD'}</span>
              </div>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                paymentMethod === 'card' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="sr-only"
                />
                <CreditCard size={24} className={paymentMethod === 'card' ? 'text-primary-500' : 'text-gray-400'} />
                <span className="mt-2 text-sm">Card</span>
              </label>
              <label className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                paymentMethod === 'ach' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ach"
                  checked={paymentMethod === 'ach'}
                  onChange={() => setPaymentMethod('ach')}
                  className="sr-only"
                />
                <DollarSign size={24} className={paymentMethod === 'ach' ? 'text-primary-500' : 'text-gray-400'} />
                <span className="mt-2 text-sm">ACH</span>
              </label>
              <label className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                paymentMethod === 'wallet' ? 'bg-primary-50 border-primary-500' : 'hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                  className="sr-only"
                />
                <Wallet size={24} className={paymentMethod === 'wallet' ? 'text-primary-500' : 'text-gray-400'} />
                <span className="mt-2 text-sm">Wallet</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full rounded-md border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full rounded-md border-gray-300"
              rows={3}
              placeholder="Optional payment notes"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
            disabled={isSaving || amount <= 0 || amount > remainingAmount}
          >
            <DollarSign size={16} />
            <span>{isSaving ? 'Processing...' : 'Record Payment'}</span>
          </button>
        </div>
      </Card>
    </div>
  );
}