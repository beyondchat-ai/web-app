-- Create OAuth Accounts Table
CREATE TABLE auth.oauth_accounts (
    provider_id TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (provider_id, provider_user_id)
);

-- Create Policies for OAuth Accounts
ALTER TABLE auth.oauth_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own OAuth accounts" ON auth.oauth_accounts
    USING (auth.session_uid() = user_id)
    WITH CHECK (auth.session_uid() = user_id);

-- Create Indexes for Performance Optimization
CREATE INDEX idx_oauth_accounts_user_id ON auth.oauth_accounts(user_id);