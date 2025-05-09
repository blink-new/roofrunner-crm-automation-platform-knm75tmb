import { z } from 'zod';

export type DataSource = 
  | 'contacts'
  | 'deals'
  | 'conversations'
  | 'jobs'
  | 'campaigns'
  | 'events'
  | 'automations'
  | 'reputation';

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'date_histogram';
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'table';
export type Schedule = 'daily' | 'weekly' | 'monthly';
export type ExportFormat = 'csv' | 'png' | 'pdf';

export interface ReportField {
  name: string;
  label: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  source: DataSource;
  aggregation?: AggregationType;
}

export interface ReportFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'between';
  value: any;
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  source: DataSource;
  fields: ReportField[];
  filters: ReportFilter[];
  visualization: {
    type: ChartType;
    options: Record<string, any>;
  };
  schedule?: {
    frequency: Schedule;
    recipients: string[];
    format: ExportFormat;
  };
  alerts?: {
    field: string;
    operator: 'gt' | 'lt';
    threshold: number;
    channel: 'email' | 'sms';
    recipients: string[];
  }[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: {
    id: string;
    report_id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
  refresh_interval?: number;
  permissions: {
    view: string[];
    edit: string[];
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const reportSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  source: z.enum(['contacts', 'deals', 'conversations', 'jobs', 'campaigns', 'events', 'automations', 'reputation']),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['number', 'string', 'date', 'boolean']),
    source: z.enum(['contacts', 'deals', 'conversations', 'jobs', 'campaigns', 'events', 'automations', 'reputation']),
    aggregation: z.enum(['sum', 'avg', 'count', 'min', 'max', 'date_histogram']).optional()
  })),
  filters: z.array(z.object({
    field: z.string(),
    operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'between']),
    value: z.any()
  })),
  visualization: z.object({
    type: z.enum(['line', 'bar', 'pie', 'area', 'scatter', 'heatmap', 'table']),
    options: z.record(z.any())
  }),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    recipients: z.array(z.string()),
    format: z.enum(['csv', 'png', 'pdf'])
  }).optional(),
  alerts: z.array(z.object({
    field: z.string(),
    operator: z.enum(['gt', 'lt']),
    threshold: z.number(),
    channel: z.enum(['email', 'sms']),
    recipients: z.array(z.string())
  })).optional()
});

export const dashboardSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  layout: z.array(z.object({
    id: z.string(),
    report_id: z.string(),
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number()
  })),
  refresh_interval: z.number().optional(),
  permissions: z.object({
    view: z.array(z.string()),
    edit: z.array(z.string())
  })
});