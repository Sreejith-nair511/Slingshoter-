# Supabase Setup Guide

## Step 1: Run the SQL Schema

1. Go to your Supabase project: https://jfsvkjgxcuokcsybqvcd.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click "Run" to execute

This will create all the necessary tables, indexes, RLS policies, and triggers.

## Step 2: Verify Tables

Go to "Table Editor" and verify these tables exist:
- users
- analyses
- claims
- notifications
- settings
- audit_logs
- benchmarks

## Step 3: Test the Connection

Run the development server:
```bash
pnpm dev
```

The app will automatically connect to Supabase using the credentials in `.env`.

## Step 4: Set Up Clerk Webhook (Optional)

To sync user data from Clerk to Supabase:

1. Go to Clerk Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to events: `user.created`, `user.updated`

## Database Structure

### Users Table
- Stores user profiles synced from Clerk
- Tracks role, tier, badge, and analysis count
- Auto-updates badge based on usage

### Analyses Table
- Stores all AI query analyses
- Links to user for tracking
- Includes optimization and hardware profile data

### Claims Table
- Individual factual claims from analyses
- Verification results and confidence scores

### Notifications Table
- Role-specific alerts
- User-specific notifications

### Settings Table
- Per-user configuration
- Thresholds and optimization preferences

### Audit Logs Table
- Complete system activity trail
- User actions and system events

### Benchmarks Table
- Performance comparison data
- Standard vs accelerated mode metrics

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to view all data (for now)
- Allow users to insert their own data
- Service role has full access

You can customize these policies in the Supabase dashboard under Authentication > Policies.

## Triggers

### Auto-Update Badge
When a new analysis is created, the user's badge is automatically updated based on their total analysis count:
- Bronze: 1-10 analyses
- Silver: 11-50 analyses
- Gold: 51-200 analyses
- Platinum: 200+ analyses

### Auto-Update Timestamps
The `updated_at` field is automatically updated on users and settings tables.

## Next Steps

1. Run the SQL schema
2. Start the development server
3. Sign in with Clerk
4. Your user will be automatically created in Supabase
5. Start analyzing queries!
