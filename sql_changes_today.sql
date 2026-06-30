-- ============================================================
-- SQL CHANGES MADE TODAY (Update Live Database)
-- ============================================================
-- Run this snippet in your Supabase SQL Editor if you want to 
-- update your existing live database WITHOUT dropping tables.

-- 1. Add the page_taken_down column to allow temp disabling users/vendors
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS page_taken_down BOOLEAN DEFAULT false;

-- 2. Update the admin password to Uniexo@2026a
UPDATE profiles 
SET password_hash = '$2b$10$f7Q78hPEi1eXTVxwTjVlJOaRhJEWAVjCd0YrJkM7NS47LZQEF8vsO' 
WHERE email = 'uniexo.in@gmail.com' AND role = 'admin';

-- 3. Add current_session_id for multiple session detection
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_session_id TEXT;

