import { Database } from './supabase';

export type Contact = Database['public']['Tables']['contacts']['Row'];

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  type: 'lead' | 'customer' | 'prospect';
  status: 'active' | 'inactive';
  tags: string[];
  custom_fields: Record<string, any>;
  dnd_settings: {
    all: boolean;
    sms: boolean;
    calls: boolean;
  };
  consent?: {
    marketing: boolean;
    marketing_date?: string;
    marketing_source?: string;
    marketing_method?: string;
  };
  lead_score?: number;
  lead_score_history?: {
    date: string;
    score: number;
    reason: string;
  }[];
  unsubscribed?: {
    email: boolean;
    sms: boolean;
    date?: string;
    reason?: string;
  };
}

export interface ContactFilters {
  search?: string;
  type?: string[];
  status?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  customFields?: Record<string, any>;
  leadScore?: {
    min?: number;
    max?: number;
  };
  consent?: {
    marketing?: boolean;
    unsubscribed?: boolean;
  };
}

export interface ImportPreview {
  headers: string[];
  rows: string[][];
  mapping: Record<string, string>;
}

export interface DuplicateContact {
  id: string;
  matchType: 'email' | 'phone' | 'name';
  contact: Contact;
  differences: Record<string, { current: any; duplicate: any }>;
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  filters: ContactFilters;
  count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface LeadScoringRule {
  id: string;
  name: string;
  description?: string;
  conditions: {
    field: string;
    operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'not_contains';
    value: any;
  }[];
  points: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  type: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ContactForm {
  id: string;
  name: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'email' | 'phone' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
  }[];
  settings: {
    redirect_url?: string;
    success_message?: string;
    notify_email?: string;
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}