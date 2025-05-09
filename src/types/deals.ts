import { Contact } from './contacts';

export interface Pipeline {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  description?: string;
  currency: string;
  close_date_offset: number;
  is_default: boolean;
  metadata: Record<string, any>;
  color_scheme?: {
    primary: string;
    secondary: string;
  };
  win_reasons?: string[];
  loss_reasons?: string[];
}

export interface PipelineStage {
  id: string;
  created_at: string;
  updated_at: string;
  pipeline_id: string;
  name: string;
  description?: string;
  position: number;
  color?: string;
  metadata: Record<string, any>;
  default_probability?: number;
  win_probability?: number;
}

export interface Deal {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  pipeline_id: string;
  stage_id: string;
  contact_id: string;
  name: string;
  amount?: number;
  currency: string;
  expected_close_date?: string;
  status: 'open' | 'won' | 'lost';
  probability: number;
  forecast_value?: number;
  score?: number;
  tags: string[];
  custom_fields: Record<string, any>;
  metadata: Record<string, any>;
  contact?: Contact;
  win_reason?: string;
  loss_reason?: string;
  duplicate_of?: string;
  duplicate_score?: number;
  duplicate_reasons?: string[];
}

export interface DealActivity {
  id: string;
  created_at: string;
  deal_id: string;
  user_id: string;
  type: string;
  description: string;
  metadata: Record<string, any>;
}

export interface DealFilters {
  search?: string;
  pipeline_id?: string;
  stage_id?: string[];
  status?: string[];
  tags?: string[];
  amount?: {
    min?: number;
    max?: number;
  };
  expected_close_date?: {
    start: Date;
    end: Date;
  };
  custom_fields?: Record<string, any>;
  score?: {
    min?: number;
    max?: number;
  };
}

export interface DealFormData {
  name: string;
  pipeline_id: string;
  stage_id: string;
  contact_id?: string;
  amount?: number;
  currency?: string;
  expected_close_date?: string;
  probability?: number;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

export interface DealScoring {
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

export interface DealDuplicate {
  id: string;
  deal_id: string;
  duplicate_id: string;
  score: number;
  reasons: string[];
  created_at: string;
}

export interface ForecastSummary {
  pipeline_id: string;
  total_value: number;
  weighted_value: number;
  by_stage: {
    stage_id: string;
    stage_name: string;
    deal_count: number;
    total_value: number;
    weighted_value: number;
  }[];
  by_month: {
    month: string;
    deal_count: number;
    total_value: number;
    weighted_value: number;
  }[];
}