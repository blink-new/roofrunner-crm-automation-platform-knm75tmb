import { supabase } from '../supabase';
import type { Invoice, LineItem } from '../../types/invoicing';

export class InvoiceService {
  static async getInvoices(filters?: {
    status?: string[];
    contactId?: string;
    dateRange?: { start: string; end: string };
  }): Promise<Invoice[]> {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        contact:contacts (id, first_name, last_name, email, phone),
        line_items:invoice_line_items (*),
        payments:payments (*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.contactId) {
      query = query.eq('contact_id', filters.contactId);
    }

    if (filters?.dateRange) {
      query = query
        .gte('issue_date', filters.dateRange.start)
        .lte('issue_date', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getInvoice(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        contact:contacts (id, first_name, last_name, email, phone),
        line_items:invoice_line_items (*),
        payments:payments (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    // Calculate totals
    const subtotal = invoice.line_items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxTotal = invoice.line_items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate;
      return sum + (itemTotal * (item.tax_rate || 0) / 100);
    }, 0);
    const discountTotal = invoice.line_items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate;
      return sum + (itemTotal * (item.discount || 0) / 100);
    }, 0);
    const total = subtotal + taxTotal - discountTotal;

    // Create invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        ...invoice,
        subtotal,
        tax_total: taxTotal,
        discount_total: discountTotal,
        total
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create line items
    const lineItems = invoice.line_items.map(item => ({
      ...item,
      invoice_id: invoiceData.id,
      total: item.quantity * item.rate * (1 + (item.tax_rate || 0) / 100 - (item.discount || 0) / 100)
    }));

    const { error: lineItemsError } = await supabase
      .from('invoice_line_items')
      .insert(lineItems);

    if (lineItemsError) throw lineItemsError;

    return {
      ...invoiceData,
      line_items: lineItems,
      payments: []
    };
  }

  static async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    // If line items are included, recalculate totals
    if (updates.line_items) {
      const subtotal = updates.line_items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const taxTotal = updates.line_items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.rate;
        return sum + (itemTotal * (item.tax_rate || 0) / 100);
      }, 0);
      const discountTotal = updates.line_items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.rate;
        return sum + (itemTotal * (item.discount || 0) / 100);
      }, 0);
      const total = subtotal + taxTotal - discountTotal;

      updates = {
        ...updates,
        subtotal,
        tax_total: taxTotal,
        discount_total: discountTotal,
        total
      };

      // Update line items
      const { error: deleteError } = await supabase
        .from('invoice_line_items')
        .delete()
        .eq('invoice_id', id);

      if (deleteError) throw deleteError;

      const lineItems = updates.line_items.map(item => ({
        ...item,
        invoice_id: id,
        total: item.quantity * item.rate * (1 + (item.tax_rate || 0) / 100 - (item.discount || 0) / 100)
      }));

      const { error: lineItemsError } = await supabase
        .from('invoice_line_items')
        .insert(lineItems);

      if (lineItemsError) throw lineItemsError;
    }

    // Update invoice
    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...updates,
        line_items: undefined // Remove line_items from the update
      })
      .eq('id', id)
      .select(`
        *,
        contact:contacts (id, first_name, last_name, email, phone),
        line_items:invoice_line_items (*),
        payments:payments (*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async sendInvoice(id: string, options?: {
    to?: string;
    cc?: string;
    bcc?: string;
    message?: string;
  }): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('send-invoice', {
        body: { invoice_id: id, ...options }
      });

    if (error) throw error;
  }

  static async duplicateInvoice(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .functions
      .invoke('duplicate-invoice', {
        body: { invoice_id: id }
      });

    if (error) throw error;
    return data;
  }

  static async recordPayment(invoiceId: string, payment: {
    amount: number;
    method: 'card' | 'ach' | 'wallet';
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .insert([{
        invoice_id: invoiceId,
        amount: payment.amount,
        method: payment.method,
        status: 'completed',
        processor: 'manual',
        metadata: payment.metadata || {}
      }]);

    if (error) throw error;

    // Update invoice status
    await this.updateInvoiceStatus(invoiceId);
  }

  static async updateInvoiceStatus(invoiceId: string): Promise<void> {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('total')
      .eq('id', invoiceId)
      .single();

    if (invoiceError) throw invoiceError;

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('invoice_id', invoiceId)
      .eq('status', 'completed');

    if (paymentsError) throw paymentsError;

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    let status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'void';

    if (totalPaid >= invoice.total) {
      status = 'paid';
    } else if (totalPaid > 0) {
      status = 'partial';
    } else {
      // Check if overdue
      const { data: invoiceData, error: invoiceDataError } = await supabase
        .from('invoices')
        .select('due_date, status')
        .eq('id', invoiceId)
        .single();

      if (invoiceDataError) throw invoiceDataError;

      if (invoiceData.status === 'void') {
        status = 'void';
      } else if (invoiceData.status === 'draft') {
        status = 'draft';
      } else if (new Date(invoiceData.due_date) < new Date()) {
        status = 'overdue';
      } else {
        status = 'sent';
      }
    }

    const { error: updateError } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId);

    if (updateError) throw updateError;
  }

  static async getHostedInvoiceUrl(id: string): Promise<string> {
    const { data, error } = await supabase
      .functions
      .invoke('get-hosted-invoice-url', {
        body: { invoice_id: id }
      });

    if (error) throw error;
    return data.url;
  }

  static async calculateTaxes(
    lineItems: Omit<LineItem, 'id' | 'invoice_id' | 'total'>[],
    contactId?: string,
    address?: {
      country: string;
      state?: string;
      city?: string;
      zip?: string;
    }
  ): Promise<{
    line_items: (Omit<LineItem, 'id' | 'invoice_id'> & { tax_details?: any })[];
    tax_summary: {
      rate: number;
      name: string;
      amount: number;
    }[];
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('calculate-taxes', {
        body: { line_items: lineItems, contact_id: contactId, address }
      });

    if (error) throw error;
    return data;
  }
}