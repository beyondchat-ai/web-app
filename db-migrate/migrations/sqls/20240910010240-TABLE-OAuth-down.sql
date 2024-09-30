-- Drop Indexes
DROP INDEX IF EXISTS idx_oauth_accounts_user_id;

-- Drop Policies
DROP POLICY IF EXISTS "Users can manage their own OAuth accounts" ON auth.oauth_accounts;

-- Drop Table
DROP TABLE IF EXISTS auth.oauth_accounts;
