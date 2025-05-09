/*
  # Initial Schema Setup

  1. Authentication
    - Using Supabase built-in auth

  2. New Tables
    - `contacts`
      - Core contact information
      - Contact type and status
      - Custom fields support
    - `conversations`
      - Message threads
      - Channel type (SMS, email, etc)
      - Thread status and metadata
    - `messages`
      - Individual messages in conversations
      - Message content and metadata
      - Attachments support
    - `tasks`
      - Task management
      - Assignment and due dates
      - Status tracking
    - `opportunities`
      - Sales pipeline tracking
      - Stage and status management
      - Value and probability tracking

  3. Security
    - Enable RLS on all tables
    - Policies for authenticated access
*/

-- Contacts Table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  type text NOT NULL DEFAULT 'lead',
  status text NOT NULL DEFAULT 'active',
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}'::jsonb,
  dnd_settings jsonb DEFAULT '{"all": false, "sms": false, "calls": false}'::jsonb
);

-- Conversations Table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  channel text NOT NULL DEFAULT 'sms',
  status text NOT NULL DEFAULT 'active',
  last_message_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Messages Table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  conversation_id uuid REFERENCES conversations(id),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  direction text NOT NULL,
  content text NOT NULL,
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Tasks Table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  title text NOT NULL,
  description text,
  due_date timestamptz,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  assigned_to uuid REFERENCES auth.users(id)
);

-- Opportunities Table
CREATE TABLE opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  title text NOT NULL,
  value decimal(10,2),
  stage text NOT NULL DEFAULT 'lead',
  status text NOT NULL DEFAULT 'open',
  probability integer DEFAULT 0,
  expected_close_date timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their conversations"
  ON conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their opportunities"
  ON opportunities
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);