-- NewsHub V2.0 Database Schema
-- Initial migration: User management, bookmarks, preferences, reading history

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');

-- ============================================
-- USERS TABLE
-- Extends Supabase auth.users with additional profile data
-- ============================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  subscription_status subscription_status DEFAULT 'active' NOT NULL,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and edit their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);

-- ============================================
-- BOOKMARKS TABLE
-- User-saved articles for later reading
-- ============================================

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  article_url TEXT NOT NULL,
  article_title TEXT NOT NULL,
  article_source TEXT NOT NULL,
  article_category TEXT NOT NULL,
  article_image_url TEXT,
  article_snippet TEXT,
  article_pub_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Prevent duplicate bookmarks per user
  UNIQUE(user_id, article_url)
);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON public.bookmarks(created_at DESC);
CREATE INDEX idx_bookmarks_category ON public.bookmarks(article_category);
CREATE INDEX idx_bookmarks_tags ON public.bookmarks USING GIN(tags);

-- ============================================
-- READING HISTORY TABLE
-- Track articles user has read
-- ============================================

CREATE TABLE public.reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  article_url TEXT NOT NULL,
  article_title TEXT NOT NULL,
  article_source TEXT NOT NULL,
  article_category TEXT NOT NULL,
  read_duration_seconds INTEGER,
  read_percentage INTEGER CHECK (read_percentage >= 0 AND read_percentage <= 100),
  last_read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  read_count INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- One history entry per user per article
  UNIQUE(user_id, article_url)
);

-- Enable Row Level Security
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own reading history"
  ON public.reading_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading history"
  ON public.reading_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading history"
  ON public.reading_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading history"
  ON public.reading_history FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_reading_history_user_id ON public.reading_history(user_id);
CREATE INDEX idx_reading_history_last_read_at ON public.reading_history(last_read_at DESC);
CREATE INDEX idx_reading_history_category ON public.reading_history(article_category);

-- ============================================
-- USER PREFERENCES TABLE
-- User settings and customization
-- ============================================

CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  theme theme_preference DEFAULT 'system' NOT NULL,
  favorite_categories TEXT[] DEFAULT '{}',
  blocked_sources TEXT[] DEFAULT '{}',
  notification_settings JSONB DEFAULT '{
    "daily_brief": true,
    "breaking_news": false,
    "category_updates": false,
    "email_frequency": "daily"
  }'::jsonb,
  display_settings JSONB DEFAULT '{
    "articles_per_page": 20,
    "show_images": true,
    "compact_view": false,
    "auto_mark_read": true
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- ============================================
-- CUSTOM RSS SOURCES TABLE
-- User-added custom RSS feeds
-- ============================================

CREATE TABLE public.custom_rss_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  source_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  fetch_interval_minutes INTEGER DEFAULT 30 NOT NULL,
  last_fetched_at TIMESTAMPTZ,
  fetch_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Prevent duplicate sources per user
  UNIQUE(user_id, url)
);

-- Enable Row Level Security
ALTER TABLE public.custom_rss_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own RSS sources"
  ON public.custom_rss_sources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own RSS sources"
  ON public.custom_rss_sources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSS sources"
  ON public.custom_rss_sources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSS sources"
  ON public.custom_rss_sources FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_custom_rss_sources_user_id ON public.custom_rss_sources(user_id);
CREATE INDEX idx_custom_rss_sources_is_active ON public.custom_rss_sources(is_active);
CREATE INDEX idx_custom_rss_sources_last_fetched ON public.custom_rss_sources(last_fetched_at);

-- ============================================
-- CACHED ARTICLES TABLE
-- Store fetched RSS articles for performance
-- ============================================

CREATE TABLE public.cached_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  pub_date TIMESTAMPTZ NOT NULL,
  content TEXT,
  content_snippet TEXT,
  source TEXT NOT NULL,
  source_name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  image_caption TEXT,
  author TEXT,
  cached_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 minutes') NOT NULL
);

-- No RLS on cached_articles - public read access
-- Articles are public data, not user-specific

-- Indexes
CREATE INDEX idx_cached_articles_category ON public.cached_articles(category);
CREATE INDEX idx_cached_articles_pub_date ON public.cached_articles(pub_date DESC);
CREATE INDEX idx_cached_articles_source ON public.cached_articles(source);
CREATE INDEX idx_cached_articles_expires_at ON public.cached_articles(expires_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_rss_sources_updated_at
  BEFORE UPDATE ON public.custom_rss_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Clean up expired cached articles
CREATE OR REPLACE FUNCTION cleanup_expired_articles()
RETURNS void AS $$
BEGIN
  DELETE FROM public.cached_articles
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA
-- ============================================

-- This will be populated by the application
-- User accounts created via Supabase Auth
-- Preferences auto-created on first login
