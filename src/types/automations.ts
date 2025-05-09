import { z } from 'zod';

export type NodeType = 'trigger' | 'condition' | 'action' | 'delay' | 'goal';

export interface Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'success' | 'failure' | 'default';
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  active: boolean;
  created_at: string;
  updated_at: string;
  last_run?: string;
  user_id: string;
  folder_id?: string;
  version: number;
  published: boolean;
  canvas_settings?: {
    zoom: number;
    position: { x: number; y: number };
    groups?: {
      id: string;
      name: string;
      nodes: string[];
      position: { x: number; y: number };
    }[];
  };
}

export interface WorkflowVersion {
  id: string;
  workflow_id: string;
  version: number;
  nodes: Node[];
  edges: Edge[];
  created_at: string;
  created_by: string;
  comment?: string;
}

export interface WorkflowFolder {
  id: string;
  name: string;
  parent_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  trigger_type: string;
  trigger_data: Record<string, any>;
  logs: {
    timestamp: string;
    node_id: string;
    message: string;
    level: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }[];
}

export interface WorkflowStats {
  workflow_id: string;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  avg_duration_ms: number;
  last_run_at?: string;
  last_run_status?: 'completed' | 'failed';
}

export const triggerSchema = z.object({
  type: z.enum([
    'contact.created',
    'contact.updated',
    'contact.tag_added',
    'contact.tag_removed',
    'deal.created',
    'deal.stage_changed',
    'deal.won',
    'deal.lost',
    'conversation.message_received',
    'conversation.unread',
    'event.created',
    'event.reminder',
    'task.added',
    'task.completed',
    'task.reminder',
    'manual'
  ]),
  config: z.record(z.any())
});

export const conditionSchema = z.object({
  type: z.enum(['if', 'switch']),
  field: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'between', 'in', 'not_in']),
  value: z.any()
});

export const actionSchema = z.object({
  type: z.enum([
    'email.send',
    'sms.send',
    'task.create',
    'field.update',
    'tag.add',
    'tag.remove',
    'deal.create',
    'deal.update',
    'webhook.call',
    'delay',
    'google_sheets.update',
    'slack.send',
    'custom_code',
    'task.notification'
  ]),
  config: z.record(z.any())
});

export const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.enum(['trigger', 'condition', 'action', 'delay', 'goal']),
    position: z.object({
      x: z.number(),
      y: z.number()
    }),
    data: z.record(z.any())
  })),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    label: z.string().optional(),
    type: z.enum(['success', 'failure', 'default']).optional()
  })),
  active: z.boolean(),
  folder_id: z.string().optional(),
  published: z.boolean().optional()
});