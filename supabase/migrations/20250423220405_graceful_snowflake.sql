/*
  # Marketing Module Schema

  1. New Tables
    - `campaigns` - Stores marketing campaigns
    - `email_templates` - Stores email templates
    - `drip_sequences` - Stores drip email sequences
    - `drip_sequence_steps` - Stores steps for drip sequences
    - `ab_tests` - Stores A/B test configurations
    - `ab_test_variants` - Stores variants for A/B tests
    - `brand_boards` - Stores brand style guides
    - `trigger_links` - Stores trigger links for campaigns
    - `social_posts` - Stores social media posts
    - `social_accounts` - Stores connected social media accounts
    - `ad_campaigns` - Stores ad campaigns
    - `ad_sets` - Stores ad sets within campaigns
    - `ads` - Stores individual ads
    - `launchpad_history` - Stores history of quick-send messages
    - `compliance_settings` - Stores compliance settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Campaigns Table
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms', 'drip', 'rss', 'ab_test')),
  subject text,
  content text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
  schedule jsonb DEFAULT '{"type": "one-time"}'::jsonb,
  stats jsonb DEFAULT '{"sent": 0, "opened": 0, "clicked": 0, "converted": 0}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Email Templates Table
CREATE TABLE email_templates (
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

-- Drip Sequences Table
CREATE TABLE drip_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  batch_settings jsonb DEFAULT '{"batch_size": 100, "interval_minutes": 60}'::jsonb,
  goal_event text,
  active boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Drip Sequence Steps Table
CREATE TABLE drip_sequence_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  sequence_id uuid REFERENCES drip_sequences(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms', 'delay', 'condition')),
  content text,
  subject text,
  delay integer,
  delay_unit text CHECK (delay_unit IN ('minutes', 'hours', 'days')),
  condition text,
  position integer NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- A/B Tests Table
CREATE TABLE ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  name text NOT NULL,
  winning_metric text NOT NULL DEFAULT 'open_rate' CHECK (winning_metric IN ('open_rate', 'click_rate', 'conversion_rate', 'revenue')),
  winner_variant_id uuid,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- A/B Test Variants Table
CREATE TABLE ab_test_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  test_id uuid REFERENCES ab_tests(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text,
  subject text,
  traffic_split integer NOT NULL DEFAULT 50,
  metrics jsonb DEFAULT '{"sent": 0, "opened": 0, "clicked": 0, "converted": 0}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Brand Boards Table
CREATE TABLE brand_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  colors jsonb NOT NULL,
  typography jsonb NOT NULL,
  logo_url text,
  assets jsonb DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Trigger Links Table
CREATE TABLE trigger_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  action text NOT NULL,
  parameters jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz,
  active boolean DEFAULT true,
  stats jsonb DEFAULT '{"clicks": 0, "unique_clicks": 0}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Social Posts Table
CREATE TABLE social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  platform text NOT NULL,
  media_urls text[],
  scheduled_at timestamptz,
  published_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  stats jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Social Accounts Table
CREATE TABLE social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  platform text NOT NULL,
  account_id text NOT NULL,
  account_name text NOT NULL,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Ad Campaigns Table
CREATE TABLE ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  platform text NOT NULL,
  objective text NOT NULL,
  budget numeric(10,2) NOT NULL,
  budget_type text NOT NULL CHECK (budget_type IN ('daily', 'lifetime')),
  start_date date NOT NULL,
  end_date date,
  audience_id text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  external_id text,
  stats jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Ad Sets Table
CREATE TABLE ad_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  campaign_id uuid REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  name text NOT NULL,
  targeting jsonb NOT NULL,
  budget numeric(10,2),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  external_id text,
  stats jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Ads Table
CREATE TABLE ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  ad_set_id uuid REFERENCES ad_sets(id) ON DELETE CASCADE,
  name text NOT NULL,
  headline text,
  description text,
  image_url text,
  destination_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'rejected')),
  external_id text,
  stats jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Launchpad History Table
CREATE TABLE launchpad_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  recipients jsonb NOT NULL,
  content text NOT NULL,
  subject text,
  stats jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Compliance Settings Table
CREATE TABLE compliance_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  unsubscribe_footer text,
  physical_address text,
  company_name text,
  privacy_policy_url text,
  terms_url text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE drip_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE drip_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE launchpad_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their drip sequences"
  ON drip_sequences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their drip sequence steps"
  ON drip_sequence_steps
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM drip_sequences
    WHERE id = drip_sequence_steps.sequence_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their A/B tests"
  ON ab_tests
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM campaigns
    WHERE id = ab_tests.campaign_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their A/B test variants"
  ON ab_test_variants
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM ab_tests
    WHERE id = ab_test_variants.test_id
    AND EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = ab_tests.campaign_id
      AND user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage their brand boards"
  ON brand_boards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their trigger links"
  ON trigger_links
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their social posts"
  ON social_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their social accounts"
  ON social_accounts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their ad campaigns"
  ON ad_campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their ad sets"
  ON ad_sets
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM ad_campaigns
    WHERE id = ad_sets.campaign_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their ads"
  ON ads
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM ad_sets
    WHERE id = ads.ad_set_id
    AND EXISTS (
      SELECT 1 FROM ad_campaigns
      WHERE id = ad_sets.campaign_id
      AND user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can view their launchpad history"
  ON launchpad_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their compliance settings"
  ON compliance_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_type ON campaigns(type);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_email_templates_user_id ON email_templates(user_id);
CREATE INDEX idx_email_templates_type ON email_templates(type);
CREATE INDEX idx_drip_sequences_user_id ON drip_sequences(user_id);
CREATE INDEX idx_drip_sequence_steps_sequence_id ON drip_sequence_steps(sequence_id);
CREATE INDEX idx_ab_tests_campaign_id ON ab_tests(campaign_id);
CREATE INDEX idx_ab_test_variants_test_id ON ab_test_variants(test_id);
CREATE INDEX idx_brand_boards_user_id ON brand_boards(user_id);
CREATE INDEX idx_trigger_links_user_id ON trigger_links(user_id);
CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX idx_social_posts_platform ON social_posts(platform);
CREATE INDEX idx_social_posts_status ON social_posts(status);
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_ad_campaigns_user_id ON ad_campaigns(user_id);
CREATE INDEX idx_ad_campaigns_platform ON ad_campaigns(platform);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_ad_sets_campaign_id ON ad_sets(campaign_id);
CREATE INDEX idx_ads_ad_set_id ON ads(ad_set_id);
CREATE INDEX idx_launchpad_history_user_id ON launchpad_history(user_id);
CREATE INDEX idx_launchpad_history_type ON launchpad_history(type);

-- Functions
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_campaigns_timestamp
BEFORE UPDATE ON campaigns
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_email_templates_timestamp
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_drip_sequences_timestamp
BEFORE UPDATE ON drip_sequences
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_brand_boards_timestamp
BEFORE UPDATE ON brand_boards
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_trigger_links_timestamp
BEFORE UPDATE ON trigger_links
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_social_posts_timestamp
BEFORE UPDATE ON social_posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_social_accounts_timestamp
BEFORE UPDATE ON social_accounts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ad_campaigns_timestamp
BEFORE UPDATE ON ad_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_compliance_settings_timestamp
BEFORE UPDATE ON compliance_settings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();