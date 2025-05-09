import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, CreditCard, DollarSign, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { InvoiceService } from '../../lib/services/InvoiceService';
import { PaymentService } from '../../lib/services/PaymentService';
import type { Invoice } from '../../types/invoicing';

export default function HostedInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
      setError('Failed to load invoice. It may have expired or been deleted.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;
    
    try {
      setPaymentStatus('processing');
      setPaymentError(null);
      
      // In a real implementation, this would integrate with Stripe, PayPal, etc.
      // For this example, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Record the payment
      await PaymentService.recordPayment(invoice.id, {
        amount: invoice.total,
        method: paymentMethod
      });
      
      setPaymentStatus('success');
      
      // Reload the invoice to get updated status
      loadInvoice();
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('error');
      setPaymentError('There was an error processing your payment. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice?.currency || 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Invoice</h2>
          <p className="text-gray-500">Please wait while we retrieve your invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Invoice Not Found</h2>
          <p className="text-gray-500 mb-4">{error || 'The requested invoice could not be found.'}</p>
          <a href="/" className="btn btn-primary">Return to Home</a>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';
  const isPartiallyPaid = invoice.status === 'partial';
  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = invoice.total - totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-primary-600 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Invoice #{invoice.number}</h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                  title="Download PDF"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-2 gap-6">
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

            <div className="grid grid-cols-3 gap-6 mt-6">
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
          </div>

          {/* Line Items */}
          <div className="p-6 border-b">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-3">
                    Description
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 uppercase tracking-wider py-3">
                    Quantity
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 uppercase tracking-wider py-3">
                    Rate
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 uppercase tracking-wider py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.line_items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(item.quantity * item.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-6 border-b">
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
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="p-6 border-b">
              {invoice.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Terms</h3>
                  <p className="text-gray-600">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Section */}
          {!isPaid && (
            <div className="p-6 bg-gray-50">
              <h2 className="text-lg font-medium mb-4">Payment</h2>
              
              {paymentStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800">Payment Successful</h3>
                    <p className="text-green-700">Thank you for your payment! A receipt has been sent to your email.</p>
                  </div>
                </div>
              ) : (
                <>
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-start gap-3">
                      <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-red-800">Payment Failed</h3>
                        <p className="text-red-700">{paymentError}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h3>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="rounded-full border-gray-300 text-primary-600"
                          />
                          <CreditCard size={20} className="text-gray-500" />
                          <span>Credit Card</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="ach"
                            checked={paymentMethod === 'ach'}
                            onChange={() => setPaymentMethod('ach')}
                            className="rounded-full border-gray-300 text-primary-600"
                          />
                          <DollarSign size={20} className="text-gray-500" />
                          <span>Bank Transfer (ACH)</span>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === 'card' ? (
                      <div className="space-y-4 border rounded-md p-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border-gray-300"
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border-gray-300"
                              placeholder="MM / YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-md border-gray-300"
                              placeholder="123"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border-gray-300"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 border rounded-md p-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border-gray-300"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border-gray-300"
                            placeholder="000123456789"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Routing Number
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border-gray-300"
                            placeholder="123456789"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                          </label>
                          <select className="w-full rounded-md border-gray-300">
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handlePayment}
                        className="btn btn-primary inline-flex items-center gap-2"
                        disabled={paymentStatus === 'processing'}
                      >
                        {paymentStatus === 'processing' ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={16} />
                            <span>Pay {isPartiallyPaid ? formatCurrency(remainingAmount) : formatCurrency(invoice.total)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}