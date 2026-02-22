# Quick Start Guide

Get the Trust Calibration Layer running in 5 minutes.

## 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

## 2. Set Up Database (Easiest Method)

```bash
# Create a free cloud database
npx create-db
```

This will:
- Create a free Prisma Postgres database
- Give you a DATABASE_URL
- No installation needed

## 3. Configure Environment

Create `.env` file:

```env
DATABASE_URL="paste-the-url-from-step-2"
OPENAI_API_KEY="paste-your-key-from-step-1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 4. Initialize Database

```bash
pnpm db:generate
pnpm db:migrate
```

## 5. Start the App

```bash
pnpm dev
```

## 6. Test It

1. Open http://localhost:3000
2. Go to Dashboard
3. Enter a query: "What is the capital of France?"
4. Watch the magic happen!

## What Just Happened?

1. Your query was sent to OpenAI GPT-4o
2. The AI extracted factual claims
3. Each claim was verified using embeddings
4. Trust metrics were calculated
5. Everything was saved to your database
6. The dashboard updated in real-time

## Next Steps

- Check `/notifications` for alerts
- View `/audit-logs` for system events
- Adjust thresholds in `/settings`
- View metrics in `/dashboard`

## Troubleshooting

### "Failed to analyze query"
- Check your OPENAI_API_KEY is correct
- Verify you have credits at https://platform.openai.com/usage

### "Database connection failed"
- Verify DATABASE_URL in .env
- Run `npx prisma db pull` to test connection

### Port 3000 in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## Need Help?

See [SETUP.md](SETUP.md) for detailed instructions.
