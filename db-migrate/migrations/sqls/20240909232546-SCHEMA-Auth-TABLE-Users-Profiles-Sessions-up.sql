-- Create 'auth' Schema 
CREATE SCHEMA IF NOT EXISTS auth;

-- USERS TABLE
--  Create Users Table under the 'auth' schema
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT email_valid CHECK (position('@' in email) > 0)  -- Ensure email is valid
);
-- Set up Password Strength Constraint
ALTER TABLE auth.users
    ADD CONSTRAINT password_strength CHECK (char_length(hashed_password) >= 60);

-- Function auth.session_uid()
CREATE OR REPLACE FUNCTION auth.session_uid()
    RETURNS UUID AS $$
    BEGIN
        RETURN current_setting('auth.session_uid')::UUID;
    END;
    $$ LANGUAGE plpgsql;

-- Enable Row-Level Security (RLS) for Users Table
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only select and update their own records
CREATE POLICY "Users can select and update their own records" ON auth.users
    USING (auth.session_uid() = id)
    WITH CHECK (auth.session_uid() = id);


-- PROFILES TABLE
-- Create Profiles Table in the 'auth' schema
CREATE TABLE auth.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT username_valid CHECK (char_length(username) >= 5)  -- non-empty username
);
-- Enable Row-Level Security (RLS) for Profiles Table
ALTER TABLE auth.profiles ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only manage their own profiles
CREATE POLICY "Users can manage their own profiles" ON auth.profiles
    USING (auth.session_uid() = user_id)
    WITH CHECK (auth.session_uid() = user_id);

-- Create a view for public access that hides user_id
CREATE VIEW auth.public_profiles AS
    SELECT username, avatar_url
    FROM auth.profiles;

-- Grant SELECT access to the public_profiles view
GRANT SELECT ON auth.public_profiles TO PUBLIC;


-- SESSIONS TABLE
-- Create Sessions Table in the 'auth' schema
CREATE TABLE auth.sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    fresh BOOLEAN DEFAULT TRUE
);

-- Create Policies for Sessions
ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sessions" ON auth.sessions
    USING (auth.session_uid() = user_id)
    WITH CHECK (auth.session_uid() = user_id);

-- Create Indexes for Performance Optimization
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_profiles_username ON auth.profiles(username);
CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON auth.sessions(expires_at);
