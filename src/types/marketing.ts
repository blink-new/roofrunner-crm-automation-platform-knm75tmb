import { z } from 'zod';

export type CampaignType = 'email' | 'sms' | 'drip' | 'rss' | 'ab_test';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  subject?: string;
  content: string;
  status: CampaignStatus;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  schedule: {
    type: 'one-time' | 'recurring';
    sendAt: string;
    recurrence?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  type: CampaignType;
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complaints: number;
}

export const campaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['email', 'sms', 'drip', 'rss', 'ab_test']),
  subject: z.string().optional(),
  content: z.string(),
  schedule: z.object({
    type: z.enum(['one-time', 'recurring']),
    sendAt: z.string(),
    recurrence: z.string().optional()
  })
});

export const templateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['email', 'sms']),
  subject: z.string().optional(),
  content: z.string()
});

export const contactListSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  filters: z.record(z.any()).optional()
});