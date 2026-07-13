-- Tags for writing posts (filterable on /writing).
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb;
