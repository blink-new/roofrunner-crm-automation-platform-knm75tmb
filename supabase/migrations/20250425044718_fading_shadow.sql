/*
  # Add Folders and Update Assets

  1. New Tables
    - `folders`
      - Core folder structure for file management
      - Hierarchical organization with parent_id
      - User ownership and metadata

  2. Changes
    - Add folder_id to assets table
    - Add foreign key constraint
    - Update indexes for performance

  3. Security
    - Enable RLS on folders table
    - Add policies for authenticated access
*/

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  parent_id uuid REFERENCES folders(id),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Add folder_id to assets
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS folder_id uuid REFERENCES folders(id);

-- Enable RLS
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their folders"
  ON folders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_assets_folder_id ON assets(folder_id);

-- Create trigger for updated_at
CREATE TRIGGER update_folders_timestamp
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();