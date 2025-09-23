-- 0001_init_designs_table.sql

-- Create the designs table
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  original_image_url TEXT,
  redesigned_image_url TEXT,
  style TEXT,
  climate_zone TEXT,
  design_catalog JSONB,
  is_pinned BOOLEAN DEFAULT false
);

-- Enable Row-Level Security
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Create policies for the designs table
CREATE POLICY "Users can view their own designs"
ON designs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own designs"
ON designs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
ON designs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
ON designs
FOR DELETE
USING (auth.uid() = user_id);
