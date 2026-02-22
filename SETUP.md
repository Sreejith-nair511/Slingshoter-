# Trust Calibration Layer - Setup Guide

This guide will help you set up the fully functional Trust Calibration Layer with real AI integration and database persistence.

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (local or cloud)
- OpenAI API key

## Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
pnpm install
```

## Step 2: Set Up Database

### Option A: Prisma Postgres (Recommended - Easiest)

```bash
# Create a free cloud database
npx create-db
```

Follow the prompts and copy the `DATABASE_URL` provided.

### Option B: Local PostgreSQL

See `scripts/setup-db.md` for detailed instructions.

### Option C: Docker

```bash
docker run --name trustcalib-postgres \
  -e POSTGRES_PASSWORD=trustcalib \
  -e POSTGRES_DB=trustcalib \
  -p 5432:5432 \
  -d postgres:15
```

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Database - Use your actual database URL
DATABASE_URL="postgresql://user:password@localhost:5432/trustcalib?schema=public"

# OpenAI - Get your API key from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-your-actual-openai-api-key-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

You should see output confirming the migration was successful.

## Step 5: Verify Database Setup

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can see your database tables.

## Step 6: Run the Application

```bash
pnpm dev
```

The application will start at `http://localhost:3000`.

## Step 7: Test the System

### Test Analysis Flow

1. Go to `http://localhost:3000/dashboard`
2. Enter a query like: "What is the capital of France?"
3. Click "Analyze"
4. Watch as the system:
   - Sends query to OpenAI
   - Extracts claims
   - Verifies each claim
   - Calculates trust metrics
   - Saves to database
   - Triggers notifications if needed

### View Results

- **Dashboard**: Real-time metrics and analysis results
- **Notifications**: `/notifications` - See triggered alerts
- **Audit Logs**: `/audit-logs` - View all system events
- **Settings**: `/settings` - Configure thresholds

## Architecture Overview

### Data Flow

```
User Query
    ↓
OpenAI API (GPT-4o)
    ↓
Claim Extraction
    ↓
Verification Layer (Embeddings + Vector Search)
    ↓
Trust Calibration (Deviation Calculation)
    ↓
PostgreSQL Database
    ↓
Real-time Dashboard Updates
```

### Key Components

1. **LLM Integration** (`lib/llm.ts`)
   - OpenAI GPT-4o for query analysis
   - Structured JSON responses
   - Confidence scoring

2. **Verification Layer** (`lib/verification.ts`)
   - Embedding generation
   - Vector similarity search
   - Reliability scoring

3. **Calibration Engine** (`lib/calibration.ts`)
   - Trust deviation calculation
   - Calibration index
   - Risk level assessment

4. **API Routes** (`app/api/`)
   - `/api/analyze` - Main analysis endpoint
   - `/api/analyses` - Fetch historical analyses
   - `/api/notifications` - Notification management
   - `/api/settings` - Configuration
   - `/api/metrics` - System metrics
   - `/api/audit-logs` - Audit trail

5. **Database** (Prisma + PostgreSQL)
   - Analysis records
   - Claims with verification
   - Notifications
   - Settings
   - Audit logs

## API Usage

### Analyze a Query

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the Eiffel Tower height?"}'
```

### Get Metrics

```bash
curl http://localhost:3000/api/metrics?timeframe=24h
```

### Get Notifications

```bash
curl http://localhost:3000/api/notifications
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### OpenAI API Issues

- Verify your API key is correct
- Check you have credits: https://platform.openai.com/usage
- Ensure the key has access to GPT-4o

### Port Already in Use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## Development Tips

### View Database in Real-time

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma migrate reset
```

### Generate New Migration

```bash
npx prisma migrate dev --name your_migration_name
```

### View Logs

Check the terminal running `pnpm dev` for:
- API requests
- Database queries
- OpenAI API calls
- Errors and warnings

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="your-production-database-url"
OPENAI_API_KEY="your-production-openai-key"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Database Migration

```bash
npx prisma migrate deploy
```

### Build and Start

```bash
pnpm build
pnpm start
```

## Performance Optimization

### Caching

The system caches:
- Embeddings for knowledge base items
- Settings (refetched every 60 seconds)
- Metrics (refetched every 30 seconds)

### Rate Limiting

Consider adding rate limiting for the `/api/analyze` endpoint in production.

### Database Indexing

The schema includes indexes on:
- `createdAt` for time-based queries
- `trustDeviation` for filtering
- `read` status for notifications

## Next Steps

1. Add more items to the knowledge base in `lib/verification.ts`
2. Customize notification thresholds in Settings
3. Integrate with your existing AI models
4. Add authentication for multi-user support
5. Set up monitoring and alerting

## Support

For issues or questions:
- Check the logs in your terminal
- Review Prisma Studio for database state
- Verify environment variables are set correctly

---

You now have a fully functional AI trust calibration platform!
