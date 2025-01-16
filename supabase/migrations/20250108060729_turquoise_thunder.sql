/*
  # Fix storage and cases policies

  1. Storage
    - Add policy for authenticated users to upload to case-images bucket
  2. Cases
    - Fix RLS policy for case creation
*/

-- Enable storage for authenticated users
INSERT INTO storage.buckets (id, name, public) 
VALUES ('case-images', 'case-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated uploads to case-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'case-images'
);

-- Update cases policy to allow authenticated users to create cases
DROP POLICY IF EXISTS "Users can create cases" ON cases;

CREATE POLICY "Users can create cases"
ON cases
FOR INSERT
TO authenticated
WITH CHECK (true);