-- ════════════════════════════════════════════════════════════════════
--  RAFAEL PORTFOLIO · CMS SCHEMA
--  Content tables mirror the shapes in src/content/types.ts.
-- ════════════════════════════════════════════════════════════════════

-- ── shared helpers ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── user roles ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Role lookup for RLS policies. SECURITY DEFINER so callers don't need
-- direct SELECT on user_roles.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
$$;

-- ── site settings (single row: the whole Profile object) ─────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── experiences (timeline roles) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  num TEXT NOT NULL DEFAULT '',
  dates TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  location_full TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  org TEXT NOT NULL DEFAULT '',
  kicker TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  stack TEXT NOT NULL DEFAULT '',
  story JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── earlier roles (compact timeline rows) ─────────────────────────────
CREATE TABLE IF NOT EXISTS earlier_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dates TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  org TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_earlier_roles_updated_at
  BEFORE UPDATE ON earlier_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── projects ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '',
  org_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  stack TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  span_full BOOLEAN NOT NULL DEFAULT false,
  url TEXT,
  story JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── writing posts (rich text) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',               -- sanitized rich HTML
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Stamp published_at the first time a post flips to published.
CREATE OR REPLACE FUNCTION stamp_post_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stamp_posts_published_at
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION stamp_post_published_at();

-- ── about page: skills, radar, achievements, education ────────────────
CREATE TABLE IF NOT EXISTS skill_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,       -- string[]
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_skill_groups_updated_at
  BEFORE UPDATE ON skill_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS radar_axes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50 CHECK (level BETWEEN 0 AND 100),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_radar_axes_updated_at
  BEFORE UPDATE ON radar_axes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  story JSONB NOT NULL DEFAULT '[]'::jsonb,       -- {type:text|image,...}[]
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY DEFAULT 'default',
  years TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── row level security ────────────────────────────────────────────────
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE earlier_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE radar_axes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- user_roles: users may read their own row; admins manage all.
CREATE POLICY "read own role" ON user_roles
  FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "admins manage roles" ON user_roles
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Public content: anyone reads the visible rows; admins manage everything.
CREATE POLICY "public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admins manage settings" ON site_settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read experiences" ON experiences
  FOR SELECT USING (active OR is_admin());
CREATE POLICY "admins manage experiences" ON experiences
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read earlier roles" ON earlier_roles
  FOR SELECT USING (active OR is_admin());
CREATE POLICY "admins manage earlier roles" ON earlier_roles
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read projects" ON projects
  FOR SELECT USING (active OR is_admin());
CREATE POLICY "admins manage projects" ON projects
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read published posts" ON posts
  FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "admins manage posts" ON posts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read skill groups" ON skill_groups FOR SELECT USING (true);
CREATE POLICY "admins manage skill groups" ON skill_groups
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read radar axes" ON radar_axes FOR SELECT USING (true);
CREATE POLICY "admins manage radar axes" ON radar_axes
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read achievements" ON achievements
  FOR SELECT USING (active OR is_admin());
CREATE POLICY "admins manage achievements" ON achievements
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "public read education" ON education FOR SELECT USING (true);
CREATE POLICY "admins manage education" ON education
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── storage: one public bucket for site assets (images + CV) ──────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "anyone can view site assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "admins upload site assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "admins update site assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND is_admin())
  WITH CHECK (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "admins delete site assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND is_admin());
