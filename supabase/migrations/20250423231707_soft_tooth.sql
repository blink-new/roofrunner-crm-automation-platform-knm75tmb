/*
# Reputation Management Schema

1. New Tables
   - Reviews and review platforms
   - Review campaigns and templates
   - Dispute tracking
   - QR codes and widgets

2. Security
   - Row Level Security policies for all tables
   - Proper access control based on ownership

3. Performance
   - Indexes for common query patterns
   - Triggers for timestamp updates
*/

-- Reviews Table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  platform text NOT NULL,
  external_id text,
  author_name text NOT NULL,
  author_image text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content text NOT NULL,
  response text,
  response_date timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged')),
  flag_reason text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Platforms Table
CREATE TABLE review_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  credentials jsonb NOT NULL,
  last_sync_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'disconnected')),
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Campaigns Table
CREATE TABLE review_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  template_id uuid,
  audience jsonb NOT NULL,
  schedule jsonb NOT NULL,
  gating_enabled boolean DEFAULT false,
  gating_threshold integer DEFAULT 3,
  platform_balance jsonb,
  active boolean DEFAULT true,
  stats jsonb DEFAULT '{"sent": 0, "opened": 0, "clicked": 0, "reviews": 0}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Templates Table
CREATE TABLE review_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  subject text,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Invites Table
CREATE TABLE review_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  campaign_id uuid REFERENCES review_campaigns(id),
  contact_id uuid,
  job_id uuid,
  template_id uuid REFERENCES review_templates(id),
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'converted', 'failed')),
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  converted_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Disputes Table
CREATE TABLE review_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  review_id uuid REFERENCES reviews(id),
  platform text NOT NULL,
  reason text NOT NULL,
  evidence text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'cancelled')),
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review QR Codes Table
CREATE TABLE review_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  settings jsonb NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review QR Code Scans Table
CREATE TABLE review_qr_code_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  qr_code_id uuid REFERENCES review_qr_codes(id),
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Widgets Table
CREATE TABLE review_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  site_id uuid,
  settings jsonb NOT NULL,
  stats jsonb DEFAULT '{"views": 0, "clicks": 0}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Review Widget Views Table
CREATE TABLE review_widget_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  widget_id uuid REFERENCES review_widgets(id),
  ip_address text,
  user_agent text,
  referrer text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_qr_code_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_widget_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their review platforms"
  ON review_platforms
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their review campaigns"
  ON review_campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their review templates"
  ON review_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their review invites"
  ON review_invites
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM review_campaigns
    WHERE id = review_invites.campaign_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their review disputes"
  ON review_disputes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their review QR codes"
  ON review_qr_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their QR code scans"
  ON review_qr_code_scans
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM review_qr_codes
    WHERE id = review_qr_code_scans.qr_code_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their review widgets"
  ON review_widgets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their widget views"
  ON review_widget_views
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM review_widgets
    WHERE id = review_widget_views.widget_id
    AND user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_platform ON reviews(platform);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_review_platforms_user_id ON review_platforms(user_id);
CREATE INDEX idx_review_platforms_name ON review_platforms(name);
CREATE INDEX idx_review_campaigns_user_id ON review_campaigns(user_id);
CREATE INDEX idx_review_campaigns_type ON review_campaigns(type);
CREATE INDEX idx_review_templates_user_id ON review_templates(user_id);
CREATE INDEX idx_review_templates_type ON review_templates(type);
CREATE INDEX idx_review_invites_campaign_id ON review_invites(campaign_id);
CREATE INDEX idx_review_invites_contact_id ON review_invites(contact_id);
CREATE INDEX idx_review_invites_status ON review_invites(status);
CREATE INDEX idx_review_disputes_user_id ON review_disputes(user_id);
CREATE INDEX idx_review_disputes_review_id ON review_disputes(review_id);
CREATE INDEX idx_review_disputes_status ON review_disputes(status);
CREATE INDEX idx_review_qr_codes_user_id ON review_qr_codes(user_id);
CREATE INDEX idx_review_qr_code_scans_qr_code_id ON review_qr_code_scans(qr_code_id);
CREATE INDEX idx_review_widgets_user_id ON review_widgets(user_id);
CREATE INDEX idx_review_widget_views_widget_id ON review_widget_views(widget_id);

-- Functions
CREATE OR REPLACE FUNCTION update_review_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_reviews_timestamp
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();

CREATE TRIGGER update_review_platforms_timestamp
BEFORE UPDATE ON review_platforms
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();

CREATE TRIGGER update_review_campaigns_timestamp
BEFORE UPDATE ON review_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();

CREATE TRIGGER update_review_templates_timestamp
BEFORE UPDATE ON review_templates
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();

CREATE TRIGGER update_review_disputes_timestamp
BEFORE UPDATE ON review_disputes
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();

CREATE TRIGGER update_review_qr_codes_timestamp
BEFORE UPDATE ON review_qr_codes
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();

CREATE TRIGGER update_review_widgets_timestamp
BEFORE UPDATE ON review_widgets
FOR EACH ROW
EXECUTE FUNCTION update_review_timestamp();