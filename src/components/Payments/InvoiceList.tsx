import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, Search, DollarSign, Calendar, User, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { InvoiceService } from '../../lib/services/InvoiceService';
import type { Invoice } from '../../types/invoicing';

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    status: string[];
    dateRange?: { start: string; end: string };
  }>({
    status: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [filters]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await InvoiceService.getInvoices(filters);
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    // Implement CSV export
    alert('Export functionality will be implemented here');
  };

  const handleBulkAction = async (action: 'send' | 'delete') => {
    if (selectedInvoices.length === 0) return;
    
    if (action === 'send') {
      if (window.confirm(`Are you sure you want to send ${selectedInvoices.length} invoices?`)) {
        try {
          for (const id of selectedInvoices) {
            await InvoiceService.sendInvoice(id);
          }
          loadInvoices();
          setSelectedInvoices([]);
        } catch (error) {
          console.error('Error sending invoices:', error);
        }
      }
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedInvoices.length} invoices?`)) {
        try {
          for (const id of selectedInvoices) {
            await InvoiceService.deleteInvoice(id);
          }
          loadInvoices();
          setSelectedInvoices([]);
        } catch (error) {
          console.error('Error deleting invoices:', error);
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const filteredInvoices = invoices.filter(invoice => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        invoice.number.toLowerCase().includes(searchLower) ||
        (invoice.contact?.first_name + ' ' + invoice.contact?.last_name).toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Invoicing', path: '/invoicing', active: true }
            ]}
          />
          <h1 className="mt-2">Invoices</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => navigate('/invoicing/new')}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="space-y-1">
                    {['draft', 'sent', 'paid', 'partial', 'overdue', 'void'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                status: [...filters.status, status]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                status: filters.status.filter(s => s !== status)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 text-sm"
                        onChange={(e) => {
                          const start = e.target.value;
                          const end = filters.dateRange?.end;
                          
                          setFilters({
                            ...filters,
                            dateRange: start ? { start, end: end || new Date().toISOString().split('T')[0] } : undefined
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 text-sm"
                        onChange={(e) => {
                          const end = e.target.value;
                          const start = filters.dateRange?.start;
                          
                          setFilters({
                            ...filters,
                            dateRange: end ? { start: start || '2000-01-01', end } : undefined
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setFilters({
                      status: []
                    });
                  }}
                  className="btn btn-secondary mr-2"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedInvoices.length > 0 && (
          <div className="bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedInvoices.length} invoice(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('send')}
                className="btn btn-secondary text-sm"
              >
                <Send size={14} className="mr-1" />
                Send
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn btn-secondary text-sm text-red-600 hover:text-red-700"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={() => {
                      if (selectedInvoices.length === filteredInvoices.length) {
                        setSelectedInvoices([]);
                      } else {
                        setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices([...selectedInvoices, invoice.id]);
                          } else {
                            setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.contact?.first_name} {invoice.contact?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => navigate(`/invoicing/${invoice.id}`)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}