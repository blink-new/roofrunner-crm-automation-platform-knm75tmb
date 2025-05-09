/*
# Sites and Funnels Schema

1. New Tables
   - Sites, funnels, pages, and related tables
   - Blog posts and categories
   - Membership plans and site members
   - Order forms, products, and upsells
   - Domains, assets, themes, and templates

2. Security
   - Row Level Security policies for all tables
   - Proper access control based on ownership

3. Performance
   - Indexes for common query patterns
   - Triggers for timestamp updates
*/

-- Create update_timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sites Table
CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  domain text,
  ssl_enabled boolean DEFAULT false,
  theme_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Funnels Table
CREATE TABLE IF NOT EXISTS funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Funnel Pages Table
CREATE TABLE IF NOT EXISTS funnel_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  funnel_id uuid REFERENCES funnels(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('landing', 'form', 'thank-you', 'upsell')),
  name text NOT NULL,
  slug text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  meta jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  position integer NOT NULL,
  published_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Page Versions Table
CREATE TABLE IF NOT EXISTS page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  page_id uuid REFERENCES funnel_pages(id) ON DELETE CASCADE,
  content jsonb NOT NULL,
  meta jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  comment text
);

-- A/B Tests Table
CREATE TABLE IF NOT EXISTS site_ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  funnel_page_id uuid REFERENCES funnel_pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  winner_variant_id uuid,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- A/B Variants Table
CREATE TABLE IF NOT EXISTS site_ab_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  test_id uuid REFERENCES site_ab_tests(id) ON DELETE CASCADE,
  name text NOT NULL,
  content jsonb NOT NULL,
  traffic_split integer NOT NULL DEFAULT 50,
  metrics jsonb DEFAULT '{"views": 0, "conversions": 0}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Forms Table
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  page_id uuid REFERENCES funnel_pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  fields jsonb NOT NULL,
  submit_button_text text NOT NULL DEFAULT 'Submit',
  success_message text,
  redirect_url text,
  notifications jsonb DEFAULT '{}'::jsonb,
  mapping jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Form Submissions Table
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  form_id uuid REFERENCES forms(id) ON DELETE CASCADE,
  data jsonb NOT NULL,
  contact_id uuid,
  opportunity_id uuid,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Tracking Scripts Table
CREATE TABLE IF NOT EXISTS tracking_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  page_id uuid REFERENCES funnel_pages(id) ON DELETE CASCADE,
  header text[] DEFAULT '{}'::text[],
  footer text[] DEFAULT '{}'::text[],
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content jsonb NOT NULL,
  excerpt text,
  featured_image text,
  author_id uuid REFERENCES auth.users(id),
  categories uuid[],
  tags text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  meta jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(site_id, slug)
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  parent_id uuid REFERENCES blog_categories(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(site_id, slug)
);

-- Membership Plans Table
CREATE TABLE IF NOT EXISTS membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'yearly', 'one_time')),
  features text[],
  access_rules jsonb NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Site Members Table
CREATE TABLE IF NOT EXISTS site_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  plan_id uuid REFERENCES membership_plans(id),
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Order Forms Table
CREATE TABLE IF NOT EXISTS order_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  funnel_id uuid REFERENCES funnels(id) ON DELETE CASCADE,
  page_id uuid REFERENCES funnel_pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  payment_methods text[] NOT NULL,
  success_message text,
  redirect_url text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Order Form Products Table
CREATE TABLE IF NOT EXISTS order_form_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  order_form_id uuid REFERENCES order_forms(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  image_url text,
  quantity integer NOT NULL DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Order Form Upsells Table
CREATE TABLE IF NOT EXISTS order_form_upsells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  order_form_id uuid REFERENCES order_forms(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  image_url text,
  position integer NOT NULL,
  type text NOT NULL CHECK (type IN ('upsell', 'downsell')),
  trigger text NOT NULL CHECK (trigger IN ('purchase', 'decline')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Domains Table
CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  domain text NOT NULL,
  is_primary boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'failed')),
  ssl_status text DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(domain)
);

-- Assets Table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  size integer NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Themes Table
CREATE TABLE IF NOT EXISTS themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  colors jsonb NOT NULL,
  typography jsonb NOT NULL,
  spacing jsonb NOT NULL,
  borders jsonb NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('page', 'funnel', 'block')),
  category text,
  thumbnail_url text,
  content jsonb NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Webhooks Table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  events text[] NOT NULL,
  secret text,
  active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Function to update funnel page positions
CREATE OR REPLACE FUNCTION update_funnel_page_positions(page_positions jsonb)
RETURNS void AS $$
DECLARE
  page_id uuid;
  position integer;
BEGIN
  FOR page_id, position IN SELECT * FROM jsonb_each_text(page_positions)
  LOOP
    UPDATE funnel_pages
    SET position = position::integer
    WHERE id = page_id::uuid;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_form_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_form_upsells ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Sites policies
CREATE POLICY "Users can manage their sites"
  ON sites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Funnels policies
CREATE POLICY "Users can manage their funnels"
  ON funnels
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites
    WHERE id = funnels.site_id
    AND user_id = auth.uid()
  ));

-- Funnel pages policies
CREATE POLICY "Users can manage their funnel pages"
  ON funnel_pages
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM funnels
    WHERE id = funnel_pages.funnel_id
    AND EXISTS (
      SELECT 1 FROM sites
      WHERE id = funnels.site_id
      AND user_id = auth.uid()
    )
  ));

-- Page versions policies
CREATE POLICY "Users can view page versions"
  ON page_versions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM funnel_pages
    WHERE id = page_versions.page_id
    AND EXISTS (
      SELECT 1 FROM funnels
      WHERE id = funnel_pages.funnel_id
      AND EXISTS (
        SELECT 1 FROM sites
        WHERE id = funnels.site_id
        AND user_id = auth.uid()
      )
    )
  ));

-- A/B tests policies
CREATE POLICY "Users can manage their A/B tests"
  ON site_ab_tests
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM funnel_pages
    WHERE id = site_ab_tests.funnel_page_id
    AND EXISTS (
      SELECT 1 FROM funnels
      WHERE id = funnel_pages.funnel_id
      AND EXISTS (
        SELECT 1 FROM sites
        WHERE id = funnels.site_id
        AND user_id = auth.uid()
      )
    )
  ));

-- A/B variants policies
CREATE POLICY "Users can manage their A/B variants"
  ON site_ab_variants
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM site_ab_tests
    WHERE id = site_ab_variants.test_id
    AND EXISTS (
      SELECT 1 FROM funnel_pages
      WHERE id = site_ab_tests.funnel_page_id
      AND EXISTS (
        SELECT 1 FROM funnels
        WHERE id = funnel_pages.funnel_id
        AND EXISTS (
          SELECT 1 FROM sites
          WHERE id = funnels.site_id
          AND user_id = auth.uid()
        )
      )
    )
  ));

-- Forms policies
CREATE POLICY "Users can manage their forms"
  ON forms
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM funnel_pages
    WHERE id = forms.page_id
    AND EXISTS (
      SELECT 1 FROM funnels
      WHERE id = funnel_pages.funnel_id
      AND EXISTS (
        SELECT 1 FROM sites
        WHERE id = funnels.site_id
        AND user_id = auth.uid()
      )
    )
  ));

-- Form submissions policies
CREATE POLICY "Users can view their form submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM forms
    WHERE id = form_submissions.form_id
    AND EXISTS (
      SELECT 1 FROM funnel_pages
      WHERE id = forms.page_id
      AND EXISTS (
        SELECT 1 FROM funnels
        WHERE id = funnel_pages.funnel_id
        AND EXISTS (
          SELECT 1 FROM sites
          WHERE id = funnels.site_id
          AND user_id = auth.uid()
        )
      )
    )
  ));

-- Blog posts policies
CREATE POLICY "Users can manage their blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites
    WHERE id = blog_posts.site_id
    AND user_id = auth.uid()
  ));

-- Blog categories policies
CREATE POLICY "Users can manage their blog categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sites
    WHERE id = blog_categories.site_id
    AND user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_funnels_site_id ON funnels(site_id);
CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON funnel_pages(funnel_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_site_ab_tests_funnel_page_id ON site_ab_tests(funnel_page_id);
CREATE INDEX IF NOT EXISTS idx_site_ab_variants_test_id ON site_ab_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_forms_page_id ON forms(page_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_site_id ON blog_posts(site_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_site_id ON blog_categories(site_id);

-- Create triggers
CREATE TRIGGER update_sites_timestamp
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_funnels_timestamp
BEFORE UPDATE ON funnels
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_funnel_pages_timestamp
BEFORE UPDATE ON funnel_pages
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_forms_timestamp
BEFORE UPDATE ON forms
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_blog_posts_timestamp
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();