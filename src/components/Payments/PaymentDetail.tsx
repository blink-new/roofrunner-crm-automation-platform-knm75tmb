import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { Payment } from '../../types/invoicing';

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Payments', path: '/payments' },
              { label: `Payment ${id}`, path: `/payments/${id}`, active: true }
            ]}
          />
          <h1 className="mt-2">Payment Details</h1>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-secondary inline-flex items-center gap-2">
            <Download size={16} />
            <span>Download Receipt</span>
          </button>
          <button className="btn btn-secondary inline-flex items-center gap-2">
            <RefreshCw size={16} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Payment Information</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">$500.00</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">Mar 15, 2025</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Method</label>
                    <p className="mt-1 text-sm text-gray-900">Credit Card</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Transaction Details</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="mt-1 text-sm text-gray-900">ch_1234567890</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Processor</label>
                    <p className="mt-1 text-sm text-gray-900">Stripe</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <p className="mt-1 text-sm text-gray-900">INV-001</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <p className="mt-1 text-sm text-gray-900">John Smith</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <p className="mt-1 text-sm text-gray-900">Mar 30, 2025</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="mt-1 text-sm text-gray-900">$1,000.00</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                <p className="mt-1 text-sm text-gray-900">$500.00</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Balance Due</label>
                <p className="mt-1 text-sm text-gray-900">$500.00</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}