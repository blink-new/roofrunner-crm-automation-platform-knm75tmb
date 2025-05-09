/*
  # Workflow Automation System

  1. New Tables
    - `workflows` - Stores workflow definitions with nodes and edges
    - `workflow_versions` - Tracks version history of workflows
    - `workflow_folders` - Organizes workflows into folders
    - `workflow_templates` - Pre-defined workflow templates
    - `workflow_executions` - Records of workflow runs
    - `workflow_execution_logs` - Detailed logs for workflow executions
    - `workflow_permissions` - Access control for workflows
    - `workflow_folder_permissions` - Access control for folders
    - `premium_actions` - Available premium workflow actions

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Create indexes for performance
*/

-- Workflows Table
CREATE TABLE workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  nodes jsonb DEFAULT '[]'::jsonb,
  edges jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT false,
  folder_id uuid,
  version integer DEFAULT 1,
  published boolean DEFAULT false,
  canvas_settings jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Workflow Versions Table
CREATE TABLE workflow_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  version integer NOT NULL,
  nodes jsonb NOT NULL,
  edges jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  comment text
);

-- Workflow Folders Table
CREATE TABLE workflow_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  parent_id uuid REFERENCES workflow_folders(id)
);

-- Workflow Templates Table
CREATE TABLE workflow_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  nodes jsonb NOT NULL,
  edges jsonb NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Workflow Executions Table
CREATE TABLE workflow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  trigger_type text NOT NULL,
  trigger_data jsonb DEFAULT '{}'::jsonb,
  logs jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Workflow Execution Logs Table
CREATE TABLE workflow_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid REFERENCES workflow_executions(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  node_id text NOT NULL,
  message text NOT NULL,
  level text NOT NULL CHECK (level IN ('info', 'warning', 'error')),
  data jsonb
);

-- Workflow Permissions Table
CREATE TABLE workflow_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  permission text NOT NULL CHECK (permission IN ('view', 'edit'))
);

-- Workflow Folder Permissions Table
CREATE TABLE workflow_folder_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  folder_id uuid REFERENCES workflow_folders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  permission text NOT NULL CHECK (permission IN ('view', 'edit'))
);

-- Premium Actions Table
CREATE TABLE premium_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  type text NOT NULL,
  description text,
  config_schema jsonb NOT NULL,
  enabled boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_folder_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their workflows"
  ON workflows
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM workflow_permissions
      WHERE workflow_id = workflows.id
      AND user_id = auth.uid()
      AND permission = 'edit'
    ) OR
    EXISTS (
      SELECT 1 FROM workflow_folder_permissions
      WHERE folder_id = workflows.folder_id
      AND user_id = auth.uid()
      AND permission = 'edit'
    )
  );

CREATE POLICY "Users can view workflow versions"
  ON workflow_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE id = workflow_versions.workflow_id
      AND (
        user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM workflow_permissions
          WHERE workflow_id = workflows.id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage their folders"
  ON workflow_folders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view templates"
  ON workflow_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their templates"
  ON workflow_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view workflow executions"
  ON workflow_executions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE id = workflow_executions.workflow_id
      AND (
        user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM workflow_permissions
          WHERE workflow_id = workflows.id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can view execution logs"
  ON workflow_execution_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflow_executions
      WHERE id = workflow_execution_logs.execution_id
      AND EXISTS (
        SELECT 1 FROM workflows
        WHERE id = workflow_executions.workflow_id
        AND (
          user_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM workflow_permissions
            WHERE workflow_id = workflows.id
            AND user_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Users can manage workflow permissions"
  ON workflow_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE id = workflow_permissions.workflow_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage folder permissions"
  ON workflow_folder_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflow_folders
      WHERE id = workflow_folder_permissions.folder_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view premium actions"
  ON premium_actions
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflows_folder_id ON workflows(folder_id);
CREATE INDEX idx_workflow_versions_workflow_id ON workflow_versions(workflow_id);
CREATE INDEX idx_workflow_folders_user_id ON workflow_folders(user_id);
CREATE INDEX idx_workflow_folders_parent_id ON workflow_folders(parent_id);
CREATE INDEX idx_workflow_templates_user_id ON workflow_templates(user_id);
CREATE INDEX idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_execution_logs_execution_id ON workflow_execution_logs(execution_id);
CREATE INDEX idx_workflow_permissions_workflow_id ON workflow_permissions(workflow_id);
CREATE INDEX idx_workflow_permissions_user_id ON workflow_permissions(user_id);
CREATE INDEX idx_workflow_folder_permissions_folder_id ON workflow_folder_permissions(folder_id);
CREATE INDEX idx_workflow_folder_permissions_user_id ON workflow_folder_permissions(user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_workflow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workflow_updated_at
BEFORE UPDATE ON workflows
FOR EACH ROW
EXECUTE FUNCTION update_workflow_updated_at();

CREATE TRIGGER update_workflow_folder_updated_at
BEFORE UPDATE ON workflow_folders
FOR EACH ROW
EXECUTE FUNCTION update_workflow_updated_at();

-- Function to clone a workflow
CREATE OR REPLACE FUNCTION clone_workflow(workflow_id uuid)
RETURNS uuid AS $$
DECLARE
  new_workflow_id uuid;
  workflow_record workflows%ROWTYPE;
BEGIN
  -- Get the workflow to clone
  SELECT * INTO workflow_record FROM workflows WHERE id = workflow_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workflow not found';
  END IF;
  
  -- Create a new workflow with the same data
  INSERT INTO workflows (
    user_id,
    name,
    description,
    nodes,
    edges,
    active,
    folder_id,
    version,
    published,
    canvas_settings,
    metadata
  ) VALUES (
    workflow_record.user_id,
    workflow_record.name || ' (Copy)',
    workflow_record.description,
    workflow_record.nodes,
    workflow_record.edges,
    false, -- Set to inactive by default
    workflow_record.folder_id,
    1, -- Reset version to 1
    false, -- Set to unpublished by default
    workflow_record.canvas_settings,
    workflow_record.metadata
  ) RETURNING id INTO new_workflow_id;
  
  RETURN new_workflow_id;
END;
$$ LANGUAGE plpgsql;

-- Insert premium actions
INSERT INTO premium_actions (
  name,
  type,
  description,
  config_schema
) VALUES 
(
  'Custom Code',
  'custom_code',
  'Execute custom JavaScript code',
  '{"type": "object", "properties": {"code": {"type": "string"}}}'
),
(
  'Google Sheets',
  'google_sheets.update',
  'Update data in Google Sheets',
  '{"type": "object", "properties": {"spreadsheet_id": {"type": "string"}, "sheet_name": {"type": "string"}, "range": {"type": "string"}, "values": {"type": "array"}}}'
),
(
  'Slack',
  'slack.send',
  'Send message to Slack channel',
  '{"type": "object", "properties": {"webhook_url": {"type": "string"}, "channel": {"type": "string"}, "message": {"type": "string"}}}'
);

-- Note: Template insertions removed to avoid foreign key constraint errors
-- Templates can be added later when users exist in the system