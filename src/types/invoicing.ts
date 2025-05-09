import { z } from 'zod';
import { Contact } from './contacts';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'void';
export type PaymentMethod = 'card' | 'ach' | 'wallet';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  tax_rate?: number;
  discount?: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  contact_id: string;
  contact?: Contact;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  currency: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  total: number;
  notes?: string;
  terms?: string;
  line_items: LineItem[];
  payments: Payment[];
  recurrence?: {
    frequency: RecurrenceFrequency;
    interval: number;
    start_date: string;
    end_date?: string;
    next_date: string;
  };
  reminders: {
    before_due: number[];
    after_due: number[];
  };
  late_fee?: {
    type: 'percentage' | 'fixed';
    value: number;
    grace_period: number;
  };
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  processor: 'stripe' | 'paypal' | 'authnet';
  metadata: Record<string, any>;
  created_at: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  line_items: Omit<LineItem, 'id'>[];
  notes?: string;
  terms?: string;
  branding: {
    logo_url?: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  footer_text?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(0),
  rate: z.number().min(0),
  tax_rate: z.number().min(0).max(100).optional(),
  discount: z.number().min(0).max(100).optional()
});

export const invoiceSchema = z.object({
  number: z.string().min(1),
  contact_id: z.string(),
  issue_date: z.string().datetime(),
  due_date: z.string().datetime(),
  currency: z.string().length(3),
  notes: z.string().optional(),
  terms: z.string().optional(),
  line_items: z.array(lineItemSchema),
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
    interval: z.number().min(1),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().optional(),
  }).optional(),
  reminders: z.object({
    before_due: z.array(z.number()),
    after_due: z.array(z.number())
  }).optional(),
  late_fee: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0),
    grace_period: z.number().min(0)
  }).optional()
});

export const paymentSchema = z.object({
  amount: z.number().min(0),
  method: z.enum(['card', 'ach', 'wallet']),
  metadata: z.record(z.any())
});

export const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  line_items: z.array(lineItemSchema),
  notes: z.string().optional(),
  terms: z.string().optional(),
  branding: z.object({
    logo_url: z.string().url().optional(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string()
    })
  }),
  footer_text: z.string().optional()
});