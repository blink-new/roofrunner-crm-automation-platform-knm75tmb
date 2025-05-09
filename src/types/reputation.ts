import { z } from 'zod';

export type ReviewPlatform = 'google' | 'facebook' | 'yelp';
export type ReviewStatus = 'pending' | 'approved' | 'flagged' | 'hidden';

export interface Review {
  id: string;
  platform: ReviewPlatform;
  rating: number;
  content: string;
  author_name: string;
  author_image?: string;
  contact_id?: string;
  job_id?: string;
  status: ReviewStatus;
  response?: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface ReviewCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms';
  template_id: string;
  audience: {
    type: 'contact' | 'segment' | 'pipeline';
    id: string;
  };
  schedule: {
    type: 'immediate' | 'delay';
    delay_days?: number;
    follow_up?: {
      enabled: boolean;
      delay_days: number;
      template_id: string;
    };
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  total: number;
  average_rating: number;
  by_rating: Record<number, number>;
  by_platform: Record<ReviewPlatform, number>;
  trend: {
    date: string;
    count: number;
    average: number;
  }[];
}

// New types for AI Review Analyzer
export interface ReviewAnalysis {
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  common_themes: {
    positive: string[];
    negative: string[];
  };
  improvement_areas: string[];
  strengths: string[];
  trend_analysis: {
    sentiment_trend: 'improving' | 'declining' | 'stable';
    description: string;
  };
  recommendations: string[];
}

export interface ReviewInsights {
  summary: string;
  key_insights: string[];
  recommendations: string[];
}

export interface AIReviewResponse {
  response: string;
  alternatives: string[];
}

// New types for Competitor Monitor
export interface Competitor {
  id: string;
  name: string;
  website: string;
  platforms: {
    google?: { id: string; name: string };
    facebook?: { id: string; name: string };
    yelp?: { id: string; name: string };
  };
  created_at: string;
  updated_at: string;
}

export interface CompetitorDetails {
  id: string;
  name: string;
  website: string;
  platforms: Record<string, {
    your_rating: number;
    your_reviews: number;
    competitor_rating: number;
    competitor_reviews: number;
  }>;
  recent_reviews: Review[];
  review_volume: {
    date: string;
    your_count: number;
    competitor_count: number;
  }[];
}

export interface CompetitorComparison {
  overall_comparison: {
    your_rating: number;
    competitor_avg_rating: number;
    your_review_count: number;
    competitor_avg_review_count: number;
  };
  platform_comparison: Record<string, {
    your_rating: number;
    competitor_ratings: Record<string, number>;
    your_review_count: number;
    competitor_review_counts: Record<string, number>;
  }>;
}

export interface CompetitorInsights {
  comparison: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  recommendations: string[];
}

export const reviewCampaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['email', 'sms']),
  template_id: z.string(),
  audience: z.object({
    type: z.enum(['contact', 'segment', 'pipeline']),
    id: z.string()
  }),
  schedule: z.object({
    type: z.enum(['immediate', 'delay']),
    delay_days: z.number().optional(),
    follow_up: z.object({
      enabled: z.boolean(),
      delay_days: z.number(),
      template_id: z.string()
    }).optional()
  })
});

export const reviewTemplateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['email', 'sms']),
  subject: z.string().optional(),
  content: z.string()
});

export const competitorSchema = z.object({
  name: z.string().min(1),
  website: z.string().url(),
  platforms: z.record(z.object({
    id: z.string(),
    name: z.string()
  }).optional())
});