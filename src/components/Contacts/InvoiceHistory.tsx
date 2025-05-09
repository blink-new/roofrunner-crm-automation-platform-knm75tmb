import React from 'react';
import { format } from 'date-fns';
import { Download, FileText, DollarSign, Clock } from 'lucide-react';
import { Card } from '../ui/card';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'void' | 'draft';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  url?: string;
}

interface InvoiceHistoryProps {
  invoices: Invoice[];
}

export default function InvoiceHistory({ invoices }: InvoiceHistoryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'unpaid':
        return 'text-red-600 bg-red-50';
      case 'void':
        return 'text-gray-600 bg-gray-50';
      case 'draft':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Invoices</h3>
        </div>

        <div className="space-y-4">
          {invoices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No invoices found</p>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <h4 className="font-medium">Invoice #{invoice.number}</h4>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Issue Date</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500">Due Date</span>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign size={14} className="text-gray-400" />
                      <span>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                {invoice.url && (
                  <div className="mt-4 flex justify-end">
                    <a
                      href={invoice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </a>
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