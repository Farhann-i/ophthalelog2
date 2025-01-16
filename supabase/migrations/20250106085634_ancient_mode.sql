/*
  # Add Cases Table and Policies
  
  1. New Tables
    - cases
      - id (uuid, primary key)
      - patient_id (text)
      - summary (text)
      - clinical_findings (text)
      - images (jsonb array)
      - tags (text array)
      - external_links (text array)
      - created_by (uuid, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)
  
  2. Security
    - Enable RLS on cases table
    - Add policies for case management
*/

-- Create cases table if it doesn't exist
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id text NOT NULL,
  summary text NOT NULL,
  clinical_findings text,
  images jsonb[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  external_links text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on cases table
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Add profile insert policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Add cases policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cases' 
    AND policyname = 'Anyone can read cases'
  ) THEN
    CREATE POLICY "Anyone can read cases"
      ON cases
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cases' 
    AND policyname = 'Users can create cases'
  ) THEN
    CREATE POLICY "Users can create cases"
      ON cases
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cases' 
    AND policyname = 'Users can update own cases'
  ) THEN
    CREATE POLICY "Users can update own cases"
      ON cases
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = created_by);
  END IF;
END $$;