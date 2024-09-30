-- Drop public_profiles view
DROP VIEW IF EXISTS auth.public_profiles;

-- Drop indexes
DROP INDEX IF EXISTS auth.idx_users_email;
DROP INDEX IF EXISTS auth.idx_profiles_username;
DROP INDEX IF EXISTS auth.idx_sessions_user_id;

-- Drop policies
DROP POLICY IF EXISTS "Users can manage their own sessions" ON auth.sessions;
DROP POLICY IF EXISTS "Users can manage their own profiles" ON auth.profiles;
DROP POLICY IF EXISTS "Users can select and update their own records" ON auth.users;

-- Drop Functions
DROP FUNCTION IF EXISTS auth.session_uid();

-- Drop Tables
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.profiles;
DROP TABLE IF EXISTS auth.users;

-- Drop Schema
DROP SCHEMA IF EXISTS auth CASCADE;
