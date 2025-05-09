/*
  # Deals Module Schema

  1. New Tables
    - `pipelines`
      - Pipeline configuration and settings
      - Default values and permissions
    - `pipeline_stages`
      - Ordered stages within pipelines
      - Position tracking for ordering
    - `deals`
      - Core deal information
      - Stage tracking and amounts
      - Custom fields support
    - `deal_activities`
      - Timeline of deal-related activities
      - Automation history

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access
*/

-- Pipelines Table
CREATE TABLE pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  currency text DEFAULT 'USD',
  close_date_offset integer DEFAULT 30,
  is_default boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Pipeline Stages Table
CREATE TABLE pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  pipeline_id uuid REFERENCES pipelines(id),
  name text NOT NULL,
  description text,
  position integer NOT NULL,
  color text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Deals Table
CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  pipeline_id uuid REFERENCES pipelines(id),
  stage_id uuid REFERENCES pipeline_stages(id),
  contact_id uuid REFERENCES contacts(id),
  name text NOT NULL,
  amount decimal(10,2),
  currency text DEFAULT 'USD',
  expected_close_date timestamptz,
  status text DEFAULT 'open',
  probability integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Deal Activities Table
CREATE TABLE deal_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  deal_id uuid REFERENCES deals(id),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their pipelines"
  ON pipelines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage pipeline stages"
  ON pipeline_stages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pipelines
      WHERE id = pipeline_stages.pipeline_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage deal activities"
  ON deal_activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE id = deal_activities.deal_id
      AND user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_pipelines_user_id ON pipelines(user_id);
CREATE INDEX idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_pipeline_id ON deals(pipeline_id);
CREATE INDEX idx_deals_stage_id ON deals(stage_id);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deal_activities_deal_id ON deal_activities(deal_id);