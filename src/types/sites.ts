import { z } from 'zod';

export type PageType = 'landing' | 'form' | 'thank-you' | 'upsell';
export type PublishStatus = 'draft' | 'published';

export interface Site {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  ssl_enabled: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Funnel {
  id: string;
  site_id: string;
  name: string;
  description?: string;
  pages: FunnelPage[];
  created_at: string;
  updated_at: string;
}

export interface FunnelPage {
  id: string;
  funnel_id: string;
  type: PageType;
  name: string;
  slug: string;
  content: PageContent;
  meta: PageMeta;
  status: PublishStatus;
  position: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface PageContent {
  sections: PageSection[];
  styles: Record<string, any>;
}

export interface PageSection {
  id: string;
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export interface PageMeta {
  title: string;
  description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  robots?: string;
}

export interface ABTest {
  id: string;
  page_id: string;
  name: string;
  variants: ABVariant[];
  traffic_split: number[];
  start_date: string;
  end_date?: string;
  winner_variant?: string;
  status: 'active' | 'paused' | 'completed';
}

export interface ABVariant {
  id: string;
  name: string;
  content: PageContent;
  metrics: {
    views: number;
    conversions: number;
    revenue?: number;
  };
}

export const siteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  domain: z.string().optional(),
});

export const funnelSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  pages: z.array(z.object({
    type: z.enum(['landing', 'form', 'thank-you', 'upsell']),
    name: z.string().min(1),
    slug: z.string().min(1),
    content: z.object({
      sections: z.array(z.object({
        type: z.string(),
        content: z.record(z.any()),
        styles: z.record(z.any())
      })),
      styles: z.record(z.any())
    }),
    meta: z.object({
      title: z.string(),
      description: z.string().optional(),
      canonical_url: z.string().optional(),
      og_title: z.string().optional(),
      og_description: z.string().optional(),
      og_image: z.string().optional(),
      robots: z.string().optional()
    }),
    status: z.enum(['draft', 'published'])
  }))
});