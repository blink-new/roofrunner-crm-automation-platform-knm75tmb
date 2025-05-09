import { z } from 'zod';

export type WidgetSize = 'small' | 'medium' | 'large';
export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'table';

export interface WidgetType {
  id: string;
  type: 'contacts' | 'opportunities' | 'pipeline' | 'revenue' | 'events' | 'conversations' | 'tasks' | 'jobs' | 'embed';
  size: WidgetSize;
  title?: string;
  dateRange?: string;
  chartType?: ChartType;
  filters?: Record<string, any>;
  target?: number;
  conditionalFormatting?: Array<{
    operator: string;
    value: number;
    color: string;
  }>;
  embedUrl?: string;
  embedWidth?: number;
  embedHeight?: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetType[];
  layout: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  isDefault: boolean;
  permissions: {
    view: string[];
    edit: string[];
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetType[];
  layout: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  isDefault?: boolean;
  permissions: {
    view: string[];
    edit: string[];
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const widgetSchema = z.object({
  type: z.enum(['contacts', 'opportunities', 'pipeline', 'revenue', 'events', 'conversations', 'tasks', 'jobs', 'embed']),
  size: z.enum(['small', 'medium', 'large']),
  title: z.string().optional(),
  dateRange: z.string().optional(),
  chartType: z.enum(['bar', 'line', 'pie', 'donut', 'area', 'table']).optional(),
  filters: z.record(z.any()).optional(),
  target: z.number().optional(),
  conditionalFormatting: z.array(
    z.object({
      operator: z.string(),
      value: z.number(),
      color: z.string()
    })
  ).optional(),
  embedUrl: z.string().url().optional(),
  embedWidth: z.number().optional(),
  embedHeight: z.number().optional()
});

export const dashboardSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  widgets: z.array(widgetSchema),
  layout: z.array(
    z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number()
    })
  ),
  isDefault: z.boolean().optional(),
  permissions: z.object({
    view: z.array(z.string()),
    edit: z.array(z.string())
  })
});