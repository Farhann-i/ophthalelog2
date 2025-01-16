/*
  # Create cases table

  1. New Tables
    - `cases`
      - `id` (uuid, primary key)
      - `patient_id` (text)
      - `summary` (text)
      - `clinical_findings` (text)
      - `images` (jsonb array)
      - `tags` (text array)
      - `external_links` (text array)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on cases table
    - Add policies for authenticated users
*/

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

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cases"
  ON cases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create cases"
  ON cases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own cases"
  ON cases
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);