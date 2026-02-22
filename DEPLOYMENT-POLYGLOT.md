# Polyglot Architecture Deployment Guide

Complete guide to deploying the Trust Calibration Layer polyglot microservices system.

## Quick Start (Docker Compose - Recommended)

### Prerequisites
- Docker Desktop installed
- OpenAI API key

### Steps

1. **Clone and setup**:
```bash
git clone https://github.com/Sreejith-nair511/Slingshoter-.git
cd Slingshoter-
cp .env.example .env
```

2. **Configure environment**:
Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

3. **Start all services**:
```bash
# Linux/Mac
chmod +x scripts/start-services.sh
./scripts/start-services.sh

# Windows
scripts\start-services.bat

# Or directly with Docker Compose
docker-compose up -d
```

4. **Initialize database**:
```bash
# Wait for services to start (30 seconds)
docker-compose exec nextjs pnpm prisma migrate deploy
```

5. **Access the application**:
- Frontend: http://localhost:3000
- Python API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Architecture Components

### Services Running

1. **PostgreSQL** (port 5432)
   - Primary database
   - Stores analyses, claims, embeddings
   - Managed by Prisma

2. **Redis** (port 6379)
   - Cache layer
   - Job queue (BullMQ)
   - Pub/sub for real-time updates

3. **Python Verification Service** (port 8000)
   - FastAPI application
   - Sentence transformers for embeddings
   - Semantic similarity analysis
   - Multi-language support

4. **Next.js Application** (port 3000)
   - React frontend
   - API routes
   - WebSocket server
   - Background workers

## Manual Setup (Development)

### 1. Start Infrastructure

#### PostgreSQL
```bash
docker run -d --name trustcalib-postgres \
  -e POSTGRES_USER=trustcalib \
  -e POSTGRES_PASSWORD=trustcalib_password \
  -e POSTGRES_DB=trustcalib \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Redis
```bash
docker run -d --name trustcalib-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 2. Start Python Service

```bash
cd services/verification

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Start Next.js Application

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### 4. Start Background Workers

In a separate terminal:
```bash
# Start BullMQ workers
node -r esbuild-register lib/workers.ts
```

## Testing the System

### 1. Test Python Service

```bash
curl -X POST http://localhost:8000/verify \
  -H "Content-Type: application/json" \
  -d '{
    "claims": [
      {"text": "The Eiffel Tower is 330 meters tall", "confidence": 95}
    ],
    "language": "en"
  }'
```

### 2. Test Next.js API

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the capital of France?",
    "language": "en"
  }'
```

### 3. Test WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3000/ws')

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['notifications', 'metrics']
  }))
}

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data))
}
```

### 4. Test Report Generation

```bash
curl -X POST http://localhost:3000/api/export-report \
  -H "Content-Type: application/json" \
  -d '{
    "analysisId": "your-analysis-id",
    "format": "pdf"
  }'
```

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs
docker-compose logs -f verification
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Health Checks

```bash
# Next.js
curl http://localhost:3000/api/health

# Python
curl http://localhost:8000/health

# Redis
docker-compose exec redis redis-cli ping

# PostgreSQL
docker-compose exec postgres pg_isready -U trustcalib
```

### Database Management

```bash
# Open Prisma Studio
pnpm db:studio

# Run migrations
pnpm db:migrate

# Reset database (WARNING: Deletes all data)
pnpm db:reset
```

### Queue Management

```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# View queues
KEYS *

# Check queue length
LLEN bull:verification:wait
LLEN bull:reports:wait

# View job details
HGETALL bull:verification:job-id
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
# Database
DATABASE_URL=postgresql://user:pass@prod-db:5432/trustcalib

# OpenAI
OPENAI_API_KEY=sk-prod-key

# Redis
REDIS_HOST=prod-redis
REDIS_PORT=6379

# Services
PYTHON_SERVICE_URL=http://verification:8000
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Node
NODE_ENV=production
```

### Build and Deploy

```bash
# Build Docker images
docker-compose build

# Push to registry
docker tag trustcalib-nextjs your-registry/trustcalib-nextjs:latest
docker push your-registry/trustcalib-nextjs:latest

docker tag trustcalib-verification your-registry/trustcalib-verification:latest
docker push your-registry/trustcalib-verification:latest

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling

#### Horizontal Scaling

```yaml
# docker-compose.prod.yml
services:
  nextjs:
    deploy:
      replicas: 3
    
  verification:
    deploy:
      replicas: 5
```

#### Load Balancing

Use nginx or cloud load balancer:

```nginx
upstream nextjs {
    server nextjs-1:3000;
    server nextjs-2:3000;
    server nextjs-3:3000;
}

upstream verification {
    server verification-1:8000;
    server verification-2:8000;
}
```

## Troubleshooting

### Python Service Issues

**Problem**: Model download fails
```bash
# Pre-download model
docker-compose exec verification python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

**Problem**: Out of memory
```yaml
# Increase memory limit in docker-compose.yml
verification:
  mem_limit: 2g
```

### Redis Connection Issues

**Problem**: Connection refused
```bash
# Check if Redis is running
docker-compose ps redis

# Restart Redis
docker-compose restart redis
```

**Problem**: Memory issues
```bash
# Check memory usage
docker-compose exec redis redis-cli INFO memory

# Clear cache
docker-compose exec redis redis-cli FLUSHDB
```

### Database Issues

**Problem**: Migration fails
```bash
# Reset and re-migrate
docker-compose exec nextjs pnpm prisma migrate reset
docker-compose exec nextjs pnpm prisma migrate deploy
```

**Problem**: Connection pool exhausted
```prisma
// Increase pool size in schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_size = 20
}
```

### WebSocket Issues

**Problem**: Connections dropping
- Check firewall rules
- Increase timeout in nginx/load balancer
- Verify WebSocket path is `/ws`

**Problem**: Not receiving updates
```bash
# Check Redis pub/sub
docker-compose exec redis redis-cli
> SUBSCRIBE notifications
```

### Performance Issues

**Problem**: Slow verification
- Increase Python service replicas
- Add more BullMQ workers
- Optimize embedding cache

**Problem**: High latency
- Enable Redis caching
- Add CDN for static assets
- Use connection pooling

## Backup and Recovery

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U trustcalib trustcalib > backup.sql

# Restore
docker-compose exec -T postgres psql -U trustcalib trustcalib < backup.sql
```

### Redis Backup

```bash
# Backup
docker-compose exec redis redis-cli SAVE
docker cp trustcalib-redis:/data/dump.rdb ./redis-backup.rdb

# Restore
docker cp ./redis-backup.rdb trustcalib-redis:/data/dump.rdb
docker-compose restart redis
```

## Security Checklist

- [ ] Change default passwords
- [ ] Use environment variables for secrets
- [ ] Enable SSL/TLS for production
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] API key rotation
- [ ] Network isolation

## Performance Benchmarks

Expected performance on standard hardware:

- **Analysis Latency**: 1-3 seconds
- **Verification Latency**: 500-1500ms
- **WebSocket Latency**: <100ms
- **Cache Hit Rate**: >80%
- **Throughput**: 100+ requests/minute
- **Concurrent Users**: 1000+

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review documentation: `POLYGLOT-ARCHITECTURE.md`
- GitHub Issues: https://github.com/Sreejith-nair511/Slingshoter-/issues

---

Your polyglot Trust Calibration Layer is now ready for production!
