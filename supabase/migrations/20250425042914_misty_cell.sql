/*
# Reports Schema

1. New Tables
   - Reports table for storing custom reports
   - Report schedules and configurations
   - Report sharing and permissions

2. Security
   - Row Level Security policies for reports
   - Access control based on ownership

3. Performance
   - Indexes for common query patterns
   - Triggers for timestamp updates
*/

-- Reports Table
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  source text NOT NULL,
  fields jsonb DEFAULT '[]'::jsonb,
  filters jsonb DEFAULT '[]'::jsonb,
  visualization jsonb DEFAULT '{}'::jsonb,
  pages jsonb DEFAULT '[]'::jsonb,
  cover_page jsonb DEFAULT '{}'::jsonb,
  theme text DEFAULT 'default',
  schedule jsonb DEFAULT null,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their reports"
  ON reports
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_source ON reports(source);

-- Functions
CREATE OR REPLACE FUNCTION update_report_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_reports_timestamp
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_report_timestamp();