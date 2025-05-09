/*
  # Dashboard Module Schema

  1. New Tables
    - `dashboards`
      - Dashboard configuration and metadata
      - Widget layout and permissions
    - `dashboard_widgets`
      - Widget configuration and settings
      - Data source and visualization options
    - `dashboard_permissions`
      - User access control for dashboards
      - View and edit permissions
    - `webhooks`
      - Webhook configuration for dashboard events
      - Security and event filtering

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access
*/

-- Dashboards Table
CREATE TABLE dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  widgets jsonb DEFAULT '[]'::jsonb,
  layout jsonb DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  permissions jsonb DEFAULT '{"view": ["*"], "edit": []}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Dashboard Widgets Table
CREATE TABLE dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  title text,
  size text NOT NULL,
  date_range text,
  chart_type text,
  filters jsonb DEFAULT '{}'::jsonb,
  target numeric,
  conditional_formatting jsonb DEFAULT '[]'::jsonb,
  embed_url text,
  embed_width integer,
  embed_height integer,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Dashboard Layouts Table
CREATE TABLE dashboard_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  widgets jsonb DEFAULT '[]'::jsonb,
  layout jsonb DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  permissions jsonb DEFAULT '{"view": ["*"], "edit": []}'::jsonb
);

-- Dashboard Permissions Table
CREATE TABLE dashboard_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  dashboard_id uuid REFERENCES dashboards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  permission text NOT NULL CHECK (permission IN ('view', 'edit'))
);

-- Webhooks Table
CREATE TABLE webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  url text NOT NULL,
  events text[] NOT NULL,
  secret text,
  active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their dashboards"
  ON dashboards
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM dashboard_permissions
      WHERE dashboard_id = dashboards.id
      AND user_id = auth.uid()
      AND permission = 'edit'
    ) OR
    (
      permissions->'view' ? '*' OR
      permissions->'view' ? auth.uid()::text OR
      EXISTS (
        SELECT 1 FROM dashboard_permissions
        WHERE dashboard_id = dashboards.id
        AND user_id = auth.uid()
        AND permission = 'view'
      )
    )
  );

CREATE POLICY "Users can manage their widgets"
  ON dashboard_widgets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their layouts"
  ON dashboard_layouts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view dashboard permissions"
  ON dashboard_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE id = dashboard_permissions.dashboard_id
      AND (
        user_id = auth.uid() OR
        permissions->'edit' ? auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can manage dashboard permissions"
  ON dashboard_permissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE id = dashboard_permissions.dashboard_id
      AND (
        user_id = auth.uid() OR
        permissions->'edit' ? auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can manage their webhooks"
  ON webhooks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX idx_dashboard_widgets_user_id ON dashboard_widgets(user_id);
CREATE INDEX idx_dashboard_layouts_user_id ON dashboard_layouts(user_id);
CREATE INDEX idx_dashboard_permissions_dashboard_id ON dashboard_permissions(dashboard_id);
CREATE INDEX idx_dashboard_permissions_user_id ON dashboard_permissions(user_id);
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_webhooks_type ON webhooks(type);

-- Functions
CREATE OR REPLACE FUNCTION update_dashboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dashboard_updated_at
BEFORE UPDATE ON dashboards
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_updated_at();

CREATE TRIGGER update_dashboard_widget_updated_at
BEFORE UPDATE ON dashboard_widgets
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_updated_at();

CREATE TRIGGER update_dashboard_layout_updated_at
BEFORE UPDATE ON dashboard_layouts
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_updated_at();

-- Function to handle dashboard cloning
CREATE OR REPLACE FUNCTION clone_dashboard(dashboard_id uuid)
RETURNS uuid AS $$
DECLARE
  new_dashboard_id uuid;
  dashboard_record dashboards%ROWTYPE;
BEGIN
  -- Get the dashboard to clone
  SELECT * INTO dashboard_record FROM dashboards WHERE id = dashboard_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dashboard not found';
  END IF;
  
  -- Create a new dashboard with the same data
  INSERT INTO dashboards (
    user_id,
    name,
    description,
    widgets,
    layout,
    is_default,
    permissions,
    metadata
  ) VALUES (
    dashboard_record.user_id,
    dashboard_record.name || ' (Copy)',
    dashboard_record.description,
    dashboard_record.widgets,
    dashboard_record.layout,
    false, -- Never set the clone as default
    dashboard_record.permissions,
    dashboard_record.metadata
  ) RETURNING id INTO new_dashboard_id;
  
  RETURN new_dashboard_id;
END;
$$ LANGUAGE plpgsql;