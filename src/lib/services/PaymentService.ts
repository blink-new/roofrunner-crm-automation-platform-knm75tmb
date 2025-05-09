import { supabase } from '../supabase';
import type { Payment } from '../../types/invoicing';

export class PaymentService {
  static async getPayments(filters?: {
    invoiceId?: string;
    status?: string[];
    method?: string[];
    dateRange?: { start: string; end: string };
  }): Promise<Payment[]> {
    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.invoiceId) {
      query = query.eq('invoice_id', filters.invoiceId);
    }

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.method?.length) {
      query = query.in('method', filters.method);
    }

    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getPayment(id: string): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async refundPayment(id: string, amount?: number): Promise<void> {
    const { error } = await supabase
      .functions
      .invoke('refund-payment', {
        body: { payment_id: id, amount }
      });

    if (error) throw error;
  }

  static async getPaymentReceipt(id: string): Promise<string> {
    const { data, error } = await supabase
      .functions
      .invoke('get-payment-receipt', {
        body: { payment_id: id }
      });

    if (error) throw error;
    return data.receipt_url;
  }

  static async createPaymentLink(options: {
    amount: number;
    description: string;
    expires_at?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    id: string;
    url: string;
    expires_at?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('create-payment-link', {
        body: options
      });

    if (error) throw error;
    return data;
  }

  static async getPaymentLinks(): Promise<any[]> {
    const { data, error } = await supabase
      .from('payment_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createText2Pay(options: {
    amount: number;
    description: string;
    phone: string;
    expires_at?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    id: string;
    url: string;
    expires_at?: string;
  }> {
    const { data, error } = await supabase
      .functions
      .invoke('create-text2pay', {
        body: options
      });

    if (error) throw error;
    return data;
  }
}