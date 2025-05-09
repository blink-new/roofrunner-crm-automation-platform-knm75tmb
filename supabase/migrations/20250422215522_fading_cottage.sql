/*
  # Add Job Cam Tables

  1. New Tables
    - `job_photos`
      - Photo metadata and storage info
      - Location data
      - Tags and categories
    - `photo_albums`
      - Group photos by job/project
      - Album metadata and settings
    - `photo_comments`
      - Comments and annotations on photos
      - User tracking for comments

  2. Security
    - Enable RLS on all new tables
    - Policies for authenticated access
*/

-- Photo Albums Table
CREATE TABLE photo_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  job_id uuid,
  name text NOT NULL,
  description text,
  cover_photo_id uuid,
  status text NOT NULL DEFAULT 'active',
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Job Photos Table
CREATE TABLE job_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  album_id uuid REFERENCES photo_albums(id),
  storage_path text NOT NULL,
  filename text NOT NULL,
  file_size integer,
  content_type text,
  width integer,
  height integer,
  taken_at timestamptz,
  location jsonb,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Photo Comments Table
CREATE TABLE photo_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  photo_id uuid REFERENCES job_photos(id),
  content text NOT NULL,
  position jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Update Albums Cover Photo Foreign Key
ALTER TABLE photo_albums
ADD CONSTRAINT photo_albums_cover_photo_id_fkey
FOREIGN KEY (cover_photo_id) REFERENCES job_photos(id);

-- Enable Row Level Security
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their photo albums"
  ON photo_albums
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their photos"
  ON job_photos
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their photo comments"
  ON photo_comments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_photo_albums_user_id ON photo_albums(user_id);
CREATE INDEX idx_photo_albums_job_id ON photo_albums(job_id);
CREATE INDEX idx_job_photos_album_id ON job_photos(album_id);
CREATE INDEX idx_job_photos_user_id ON job_photos(user_id);
CREATE INDEX idx_photo_comments_photo_id ON photo_comments(photo_id);
CREATE INDEX idx_photo_comments_user_id ON photo_comments(user_id);