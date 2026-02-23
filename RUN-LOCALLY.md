# Run Locally - Quick Start

## Prerequisites
All credentials are already configured in `.env`!

## Step 1: Set Up Supabase Database

1. Go to: https://jfsvkjgxcuokcsybqvcd.supabase.co
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy ALL contents from `supabase/schema.sql`
5. Paste and click "Run"

This creates all tables, indexes, and triggers.

## Step 2: Start the Application

```bash
pnpm dev
```

The app will start at http://localhost:3000

## Step 3: Sign In

1. Go to http://localhost:3000
2. Click "Sign In" (Clerk will handle authentication)
3. Create an account or sign in
4. You'll be automatically created in Supabase with role: "student"

## Step 4: Test the System

1. Go to Dashboard
2. Enter a query: "What is the capital of France?"
3. Click "Analyze"
4. Watch the AI analyze, verify, and calculate trust metrics!

## Features Available

### All Users
- AI query analysis with Groq (Mixtral)
- Trust calibration metrics
- Claim verification
- Real-time dashboard

### Role-Based Features

**Student** (default):
- Basic analysis
- Basic metrics
- Limited history

**Researcher**:
- Advanced graphs
- Claim-level details
- Export reports

**Enterprise**:
- Full analytics
- Audit logs
- Risk heatmaps
- System health

**AMD Partner**:
- AMD Optimization Panel
- Performance benchmarks
- Hardware acceleration toggle

**Admin**:
- All features
- User management
- System-wide analytics

## Change Your Role

To test different roles:

1. Go to Supabase: https://jfsvkjgxcuokcsybqvcd.supabase.co
2. Click "Table Editor" > "users"
3. Find your user (by email)
4. Edit the "role" field to: `researcher`, `enterprise`, `amd_partner`, or `admin`
5. Refresh the dashboard

## Badge System

Your badge automatically updates based on usage:
- Bronze: 1-10 analyses
- Silver: 11-50 analyses
- Gold: 51-200 analyses
- Platinum: 200+ analyses

## AMD Optimization

If you're an AMD Partner:
1. Go to Dashboard
2. See "AMD Acceleration Layer" panel
3. Toggle "Enable Edge Acceleration"
4. Watch latency improve!

## Troubleshooting

### "Failed to analyze query"
- Check Groq API key in `.env`
- Verify the `GROQ_API_KEY` is set correctly

### "Database error"
- Make sure you ran the SQL schema in Supabase
- Check Supabase URL and keys in `.env`

### "Authentication error"
- Verify Clerk keys in `.env`
- Check: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

## API Endpoints

- `POST /api/analyze` - Analyze a query
- `GET /api/analyses` - Get analysis history
- `GET /api/notifications` - Get notifications
- `GET /api/metrics` - Get system metrics
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

## Tech Stack

- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq (Mixtral-8x7b)
- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4

## Next Steps

1. Run analyses to increase your badge tier
2. Change your role to test different features
3. Enable AMD optimization (if AMD Partner)
4. Check notifications for alerts
5. View audit logs for system activity

---

Everything is configured and ready to go! Just run the SQL schema and start the app.
