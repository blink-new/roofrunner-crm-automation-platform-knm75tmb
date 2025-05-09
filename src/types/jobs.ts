import { z } from 'zod';

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
  job_id?: string;
  contact_id?: string;
  tags?: string[];
  reminders?: {
    type: 'email' | 'sms';
    minutes: number;
  }[];
  metadata?: Record<string, any>;
}

export interface RecurringTask {
  id: string;
  created_at: string;
  template_id: string;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    days?: number[];
    time?: string;
    end_date?: string;
  };
  active: boolean;
}

export interface ChecklistTemplate {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  items: {
    title: string;
    required: boolean;
    type: 'checkbox' | 'text' | 'number' | 'signature';
    options?: string[];
  }[];
}

export interface ChecklistItem {
  id: string;
  job_id: string;
  template_id?: string;
  title: string;
  type: 'checkbox' | 'text' | 'number' | 'signature';
  required: boolean;
  completed: boolean;
  value?: string;
  position: number;
  completed_at?: string;
  completed_by?: string;
}

export interface JobFilters {
  search?: string;
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  assignedTo?: string[];
  jobType?: string[];
  tags?: string[];
  customFields?: Record<string, any>;
}

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
  job_id: z.string().optional(),
  contact_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  reminders: z.array(z.object({
    type: z.enum(['email', 'sms']),
    minutes: z.number()
  })).optional()
});