# Supabase Setup Guide

Complete guide for setting up Supabase database integration for NewsHub V2.0

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Run Database Migrations](#run-database-migrations)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Verify Setup](#verify-setup)
6. [Database Schema Overview](#database-schema-overview)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Supabase account (free tier available)
- Node.js 18+ installed
- NewsHub project cloned locally

---

## Create Supabase Project

### Step 1: Sign Up for Supabase

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email address

### Step 2: Create New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in project details:
   - **Name**: `newshub-v2` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US West, EU West)
   - **Pricing Plan**: Free tier is sufficient for development
3. Click "Create new project"
4. Wait 2-3 minutes for project initialization

### Step 3: Get API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values (you'll need these later):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: Long JWT token starting with `eyJ...`
   - **service_role key**: Another JWT token (keep this secret!)

---

## Run Database Migrations

### Option 1: Using Supabase SQL Editor (Recommended for First-Time Setup)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open the migration file from your local project:
   ```
   newshub-v1/supabase/migrations/001_initial_schema.sql
   ```
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" button
7. Verify success - you should see "Success. No rows returned"

### Option 2: Using Supabase CLI (For Advanced Users)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

### Verify Migration Success

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `users`
   - `bookmarks`
   - `reading_history`
   - `user_preferences`
   - `custom_rss_sources`
   - `cached_articles`

---

## Configure Environment Variables

### Step 1: Create Local Environment File

```bash
# From newshub-v1/ directory
cp .env.example .env.local
```

### Step 2: Fill in Supabase Credentials

Edit `.env.local` and update these lines:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important Notes:**
- Replace `your-project-id` with your actual Supabase project ID
- The `ANON_KEY` is safe to expose in client-side code
- The `SERVICE_ROLE_KEY` should NEVER be exposed to the client
- Never commit `.env.local` to git (it's already in `.gitignore`)

---

## Verify Setup

### Test Database Connection

Create a test file to verify your setup works:

```typescript
// test-supabase.ts
import { getSupabaseBrowserClient } from './src/lib/supabase/client';

async function testConnection() {
  const supabase = getSupabaseBrowserClient();

  // Test query
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1);

  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully!');
  }
}

testConnection();
```

Run the test:

```bash
npx tsx test-supabase.ts
```

### Check Row Level Security (RLS)

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. You should see RLS policies for each table
3. Verify policies exist for:
   - `Users can view own profile`
   - `Users can view own bookmarks`
   - `Users can view own reading history`
   - etc.

---

## Database Schema Overview

### Tables Created

#### 1. `users`
- Extends Supabase Auth with profile data
- Fields: email, full_name, avatar_url, subscription info
- RLS: Users can only see/edit their own profile

#### 2. `bookmarks`
- Saved articles for later reading
- Fields: article data, notes, tags
- RLS: Users can only see/edit their own bookmarks

#### 3. `reading_history`
- Track articles user has read
- Fields: article data, read duration, read count
- RLS: Users can only see/edit their own history

#### 4. `user_preferences`
- User settings and customization
- Fields: theme, favorite categories, notification settings
- RLS: Users can only see/edit their own preferences

#### 5. `custom_rss_sources`
- User-added custom RSS feeds
- Fields: name, url, category, fetch status
- RLS: Users can only see/edit their own sources

#### 6. `cached_articles`
- Cache for fetched RSS articles (30min TTL)
- Fields: article content, metadata, expiration
- RLS: Public read access (no auth required)

### Indexes Created

Performance optimizations for common queries:
- User lookups by email
- Bookmarks by user and creation date
- Reading history by user and read date
- Articles by category, publication date, source

### Functions Created

Automatic database maintenance:
- `update_updated_at_column()` - Auto-update timestamps
- `cleanup_expired_articles()` - Remove old cached articles

---

## Troubleshooting

### Error: "relation does not exist"

**Cause**: Migration hasn't run successfully

**Fix**:
1. Go to Supabase SQL Editor
2. Run the migration manually (see "Run Database Migrations" section)
3. Verify tables exist in Table Editor

### Error: "Invalid API key"

**Cause**: Wrong API key in environment variables

**Fix**:
1. Go to Settings → API in Supabase dashboard
2. Copy the correct keys
3. Update `.env.local`
4. Restart dev server

### Error: "Row Level Security policy violation"

**Cause**: RLS policies blocking access

**Fix**:
1. Make sure user is authenticated
2. Verify RLS policies exist (SQL Editor → Run `SELECT * FROM pg_policies;`)
3. Check that `auth.uid()` matches the user_id in the query

### Error: "Could not connect to database"

**Cause**: Network issue or wrong project URL

**Fix**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
2. Check your internet connection
3. Verify project is running in Supabase dashboard
4. Check project isn't paused (free tier auto-pauses after inactivity)

### Tables Not Showing in Table Editor

**Cause**: Migration failed silently

**Fix**:
1. Go to SQL Editor
2. Run: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
3. Check output - should list all 6 tables
4. If empty, re-run migration

---

## Next Steps

After completing this setup:

1. **Enable Authentication** (Phase 2.2)
   - Set up Supabase Auth UI
   - Configure OAuth providers (Google, GitHub, etc.)
   - Create sign-up/sign-in pages

2. **Create API Routes** (Phase 2.4)
   - Build endpoints for user data
   - Implement bookmark CRUD operations
   - Add reading history tracking

3. **Build User Dashboard** (Phase 2.3)
   - Create `/account` page
   - Display user profile
   - Show subscription status

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Last Updated**: 2025-01-21
**Version**: 2.0
**Phase**: 2.1 - Database Integration
