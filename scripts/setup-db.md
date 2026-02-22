# Database Setup Guide

## Option 1: Local PostgreSQL

### Install PostgreSQL

**Windows:**
Download from https://www.postgresql.org/download/windows/

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE trustcalib;

# Create user (optional)
CREATE USER trustcalib_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trustcalib TO trustcalib_user;

# Exit
\q
```

### Update .env

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/trustcalib?schema=public"
```

## Option 2: Prisma Postgres (Cloud - Easiest)

```bash
# Install Prisma CLI globally
npm install -g prisma

# Create a free Prisma Postgres database
npx create-db

# Follow prompts and copy the DATABASE_URL to .env
```

## Option 3: Docker

```bash
# Run PostgreSQL in Docker
docker run --name trustcalib-postgres \
  -e POSTGRES_PASSWORD=trustcalib \
  -e POSTGRES_DB=trustcalib \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:trustcalib@localhost:5432/trustcalib?schema=public"
```

## Run Migrations

After setting up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## Verify Setup

```bash
# Check database connection
npx prisma db pull
```

If successful, you're ready to run the application!
