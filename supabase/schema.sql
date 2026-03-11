-- ============================================================
-- CV Portfolio - Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- TABLE: settings
-- Stores singular profile info (name, title, bio, etc.)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: skills
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,  -- Frontend, Backend, Database, Tools
  percentage INTEGER DEFAULT 80 CHECK (percentage >= 0 AND percentage <= 100),
  icon TEXT,               -- optional icon name
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: projects
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],       -- array of tech tags
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: experience
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,           -- NULL means current
  description TEXT,
  location TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: education
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  start_year TEXT,
  end_year TEXT,
  gpa TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: achievements
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT,
  description TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: messages (contact form submissions)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- TABLE: quotes (motivational quotes, auto-cleaned)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  author TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to delete quotes older than 24 hours
CREATE OR REPLACE FUNCTION cleanup_old_quotes() RETURNS void AS $$
BEGIN
  DELETE FROM quotes WHERE fetched_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills    ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages  ENABLE ROW LEVEL SECURITY;

-- Public can read settings, skills, projects, experience, education, achievements
CREATE POLICY "Public read settings"   ON settings   FOR SELECT USING (true);
CREATE POLICY "Public read skills"     ON skills     FOR SELECT USING (true);
CREATE POLICY "Public read projects"   ON projects   FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read education"  ON education  FOR SELECT USING (true);
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);

-- Public can insert messages (contact form)
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Quotes auto-fetch policies (frontend saves API quotes)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read quotes" ON quotes FOR SELECT USING (true);
CREATE POLICY "Public insert quotes" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete quotes" ON quotes FOR DELETE USING (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Auth all settings"   ON settings   FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth all skills"     ON skills     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth all projects"   ON projects   FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth all experience" ON experience FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth all education"  ON education  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth all achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth all messages"   ON messages   FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- (Run after enabling Storage in Supabase dashboard)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('cv', 'cv', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('projects', 'projects', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies - public read
CREATE POLICY "Public read avatars"  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public read cv"       ON storage.objects FOR SELECT USING (bucket_id = 'cv');
CREATE POLICY "Public read projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');

-- Authenticated upload
CREATE POLICY "Auth write avatars"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars'  AND auth.role() = 'authenticated');
CREATE POLICY "Auth write cv"       ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv'       AND auth.role() = 'authenticated');
CREATE POLICY "Auth write projects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete avatars"  ON storage.objects FOR DELETE USING (bucket_id = 'avatars'  AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete cv"       ON storage.objects FOR DELETE USING (bucket_id = 'cv'       AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects" ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update avatars"  ON storage.objects FOR UPDATE USING (bucket_id = 'avatars'  AND auth.role() = 'authenticated');
CREATE POLICY "Auth update cv"       ON storage.objects FOR UPDATE USING (bucket_id = 'cv'       AND auth.role() = 'authenticated');
CREATE POLICY "Auth update projects" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (optional, demonstrates structure)
-- ============================================================

INSERT INTO settings (key, value) VALUES
  ('name', 'Hammad Raheel Sarwar'),
  ('title', 'Full-Stack Developer & CS Student'),
  ('bio', 'I am a passionate Computer Science student and full-stack developer with a love for building modern, scalable web applications. I enjoy turning complex problems into elegant, user-friendly solutions.'),
  ('career_objective', 'Seeking opportunities to leverage my technical skills in web development while continuing to learn and grow as a software engineer.'),
  ('github', 'https://github.com/yourusername'),
  ('linkedin', 'https://linkedin.com/in/yourusername'),
  ('email', 'youremail@example.com'),
  ('location', 'Pakistan'),
  ('profile_image_url', ''),
  ('cv_url', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO skills (name, category, percentage) VALUES
  ('React', 'Frontend', 90),
  ('JavaScript', 'Frontend', 88),
  ('TypeScript', 'Frontend', 75),
  ('HTML/CSS', 'Frontend', 95),
  ('Tailwind CSS', 'Frontend', 90),
  ('Node.js', 'Backend', 80),
  ('Express.js', 'Backend', 78),
  ('Python', 'Backend', 72),
  ('PostgreSQL', 'Database', 75),
  ('MongoDB', 'Database', 70),
  ('Supabase', 'Database', 85),
  ('Git / GitHub', 'Tools', 90),
  ('VS Code', 'Tools', 95),
  ('Figma', 'Tools', 68)
ON CONFLICT DO NOTHING;
