import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Send, Copy, Trash2, Edit, 
  Plus, DollarSign, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { InvoiceService } from '../../lib/services/InvoiceService';
import { PaymentService } from '../../lib/services/PaymentService';
import PartialPaymentModal from './PartialPaymentModal';
import PaymentHistoryPanel from './PaymentHistoryPanel';
import type { Invoice } from '../../types/invoicing';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPartialPaymentModal, setShowPartialPaymentModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await InvoiceService.getInvoice(id!);
      setInvoice(data);
    } catch (err) {
      console.error('Error loading invoice:', err);
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!invoice) return;
    
    try {
      setSendingEmail(true);
      await InvoiceService.sendInvoice(invoice.id);
      setEmailSent(true);
      
      // Reload invoice to get updated status
      loadInvoice();
      
      // Reset email sent status after 3 seconds
      setTimeout(() => {
        setEmailSent(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending invoice:', err);
      setError('Failed to send invoice');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDuplicateInvoice = async () => {
    if (!invoice) return;
    
    try {
      const duplicatedInvoice = await InvoiceService.duplicateInvoice(invoice.id);
      navigate(`/invoicing/${duplicatedInvoice.id}`);
    } catch (err) {
      console.error('Error duplicating invoice:', err);
      setError('Failed to duplicate invoice');
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;
    
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await InvoiceService.deleteInvoice(invoice.id);
        navigate('/invoicing');
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice');
      }
    }
  };

  const handleRecordPayment = async (amount: number) => {
    if (!invoice) return;
    
    try {
      await PaymentService.recordPayment(invoice.id, {
        amount,
        method: 'card',
        metadata: { recorded_manually: true }
      });
      
      setShowPartialPaymentModal(false);
      
      // Reload invoice to get updated status and payment history
      loadInvoice();
    } catch (err) {
      console.error('Error recording payment:', err);
      setError('Failed to record payment');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice?.currency || 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'void':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/invoicing')}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        
        <Card className="p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </Card>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/invoicing')}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Invoice Not Found</h1>
        </div>
        
        <Card className="p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Invoice</h2>
          <p className="text-gray-500 mb-4">{error || 'The requested invoice could not be found.'}</p>
          <button
            onClick={() => navigate('/invoicing')}
            className="btn btn-primary"
          >
            Back to Invoices
          </button>
        </Card>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';
  const isPartiallyPaid = invoice.status === 'partial';
  const isDraft = invoice.status === 'draft';
  const isVoid = invoice.status === 'void';
  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = invoice.total - totalPaid;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Invoicing', path: '/invoicing' },
              { label: `Invoice #${invoice.number}`, path: `/invoicing/${id}`, active: true }
            ]}
          />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate('/invoicing')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h1>Invoice #{invoice.number}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/invoicing/view/${invoice.id}`, '_blank')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
          
          {!isVoid && !isPaid && (
            <button
              onClick={handleSendInvoice}
              className="btn btn-primary inline-flex items-center gap-2"
              disabled={sendingEmail}
            >
              <Send size={16} />
              <span>{sendingEmail ? 'Sending...' : emailSent ? 'Sent!' : 'Send'}</span>
            </button>
          )}
          
          <div className="relative group">
            <button className="btn btn-secondary inline-flex items-center gap-2">
              <span>More</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
              <button
                onClick={() => navigate(`/invoicing/${invoice.id}/edit`)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Edit size={14} className="inline-block mr-2" />
                Edit Invoice
              </button>
              <button
                onClick={handleDuplicateInvoice}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Copy size={14} className="inline-block mr-2" />
                Duplicate
              </button>
              {!isPaid && !isVoid && (
                <button
                  onClick={() => setShowPartialPaymentModal(true)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <DollarSign size={14} className="inline-block mr-2" />
                  Record Payment
                </button>
              )}
              <button
                onClick={handleDeleteInvoice}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} className="inline-block mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Invoice Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">From</h3>
                <p className="font-medium">Your Company Name</p>
                <p className="text-gray-600">123 Business St</p>
                <p className="text-gray-600">City, State 12345</p>
                <p className="text-gray-600">contact@example.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">To</h3>
                <p className="font-medium">{invoice.contact?.first_name} {invoice.contact?.last_name}</p>
                <p className="text-gray-600">{invoice.contact?.email}</p>
                <p className="text-gray-600">{invoice.contact?.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Invoice Number</h3>
                <p className="font-medium">{invoice.number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Issue Date</h3>
                <p className="font-medium">{new Date(invoice.issue_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.line_items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.quantity * item.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax_total > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(invoice.tax_total)}</span>
                  </div>
                )}
                {invoice.discount_total > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium">-{formatCurrency(invoice.discount_total)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                {isPartiallyPaid && (
                  <>
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Paid</span>
                      <span>{formatCurrency(totalPaid)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Balance Due</span>
                      <span>{formatCurrency(remainingAmount)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {(invoice.notes || invoice.terms) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                {invoice.notes && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Notes</h3>
                    <p className="text-gray-600">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Terms</h3>
                    <p className="text-gray-600">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-medium">{formatCurrency(invoice.total)}</span>
              </div>
              {isPartiallyPaid && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paid</span>
                    <span className="text-green-600">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Balance</span>
                    <span className="font-bold">{formatCurrency(remainingAmount)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                {!isPaid && !isVoid && (
                  <>
                    <button
                      onClick={handleSendInvoice}
                      className="w-full btn btn-primary inline-flex items-center justify-center gap-2"
                      disabled={sendingEmail}
                    >
                      <Send size={16} />
                      <span>{sendingEmail ? 'Sending...' : 'Send Invoice'}</span>
                    </button>
                    <button
                      onClick={() => setShowPartialPaymentModal(true)}
                      className="w-full btn btn-secondary inline-flex items-center justify-center gap-2"
                    >
                      <DollarSign size={16} />
                      <span>Record Payment</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => window.open(`/invoicing/view/${invoice.id}`, '_blank')}
                  className="w-full btn btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </Card>

          <PaymentHistoryPanel payments={invoice.payments} />
        </div>
      </div>

      {showPartialPaymentModal && (
        <PartialPaymentModal
          invoice={invoice}
          onClose={() => setShowPartialPaymentModal(false)}
          onSave={handleRecordPayment}
        />
      )}
    </div>
  );
}