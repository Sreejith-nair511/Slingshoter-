# Polyglot Architecture Guide

Trust Calibration Layer now features a complete polyglot microservices architecture with multiple languages and technologies working together.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│                  (WebSocket + HTTP)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Next.js Frontend (TypeScript)                  │
│  - React 19 UI Components                                   │
│  - Server Actions & API Routes                              │
│  - WebSocket Server                                         │
│  - Background Task Queue (BullMQ)                           │
└─────┬──────────┬──────────┬──────────┬──────────────────────┘
      │          │          │          │
      │          │          │          │
┌─────▼──────┐ ┌▼─────────┐ ┌▼────────▼──┐ ┌─────────────────┐
│ PostgreSQL │ │  Redis   │ │  Python    │ │   OpenAI API    │
│  Database  │ │  Cache   │ │Verification│ │   (GPT-4o)      │
│  (Prisma)  │ │  Queue   │ │  Service   │ │                 │
│            │ │  Pub/Sub │ │ (FastAPI)  │ │                 │
└────────────┘ └──────────┘ └────────────┘ └─────────────────┘
```

## Services

### 1. Next.js Application (TypeScript)
**Port**: 3000  
**Role**: Frontend, API Gateway, WebSocket Server

**Responsibilities**:
- User interface rendering
- API route handling
- WebSocket real-time updates
- Background job orchestration
- PDF report generation
- Authentication & authorization
- Rate limiting

**Key Files**:
- `app/api/*` - API routes
- `lib/websocket.ts` - WebSocket server
- `lib/queue.ts` - Job queue management
- `lib/redis.ts` - Redis utilities
- `lib/pdf-generator.ts` - Report generation

### 2. Python Verification Service (FastAPI)
**Port**: 8000  
**Role**: AI Verification & Embeddings

**Responsibilities**:
- Semantic similarity analysis
- Embedding generation (sentence-transformers)
- Contradiction detection
- Multi-language support (EN, HI, ES, FR, DE)
- Vector similarity search
- Knowledge base matching

**Key Files**:
- `services/verification/main.py` - FastAPI application
- `services/verification/requirements.txt` - Python dependencies
- `services/verification/Dockerfile` - Container definition

**Endpoints**:
- `POST /verify` - Verify claims with embeddings
- `POST /embeddings` - Generate embeddings
- `GET /health` - Health check

### 3. PostgreSQL Database
**Port**: 5432  
**Role**: Primary Data Store

**Schema**:
- `Analysis` - Query analysis records
- `Claim` - Individual claims with verification
- `Embedding` - Vector embeddings storage
- `Notification` - System alerts
- `Settings` - Configuration
- `AuditLog` - Complete audit trail

### 4. Redis
**Port**: 6379  
**Role**: Cache, Queue, Pub/Sub

**Usage**:
- **Cache**: LLM responses, verification results
- **Queue**: Background jobs (BullMQ)
- **Pub/Sub**: Real-time notifications
- **Rate Limiting**: API throttling

## Data Flow

### Analysis Pipeline

1. **User submits query** → Next.js API
2. **Rate limit check** → Redis
3. **Cache check** → Redis (30min TTL)
4. **LLM analysis** → OpenAI GPT-4o
5. **Claim extraction** → Structured JSON
6. **Queue verification job** → Redis/BullMQ
7. **Python verification** → FastAPI service
   - Generate embeddings
   - Semantic similarity
   - Contradiction detection
8. **Store embeddings** → PostgreSQL
9. **Calculate metrics** → Trust calibration
10. **Save to database** → PostgreSQL
11. **Check thresholds** → Trigger notifications
12. **Publish updates** → Redis Pub/Sub
13. **Broadcast to clients** → WebSocket
14. **Cache result** → Redis
15. **Return response** → Client

### Real-Time Updates

```
Analysis Complete → Redis Pub/Sub → WebSocket Server → All Connected Clients
```

### Background Jobs

```
Heavy Task → BullMQ Queue → Worker Process → Result Storage → Notification
```

## API Endpoints

### Next.js APIs

#### Analysis
- `POST /api/analyze` - Analyze query with full pipeline
- `GET /api/analyses` - List historical analyses

#### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications` - Mark as read

#### Settings
- `GET /api/settings` - Get configuration
- `PUT /api/settings` - Update thresholds

#### Metrics & Analytics
- `GET /api/metrics` - System metrics
- `GET /api/analytics` - Advanced analytics

#### Reports
- `POST /api/export-report` - Generate PDF/JSON report
- `GET /api/export-report?jobId=xxx` - Check job status

#### Audit
- `GET /api/audit-logs` - Audit trail

### Python APIs

#### Verification
- `POST /verify` - Verify claims
  ```json
  {
    "claims": [
      {"text": "...", "confidence": 95}
    ],
    "language": "en"
  }
  ```

- `POST /embeddings` - Generate embeddings
  ```json
  {
    "texts": ["text1", "text2"]
  }
  ```

## WebSocket Protocol

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws')
```

### Subscribe
```json
{
  "type": "subscribe",
  "channels": ["notifications", "metrics"]
}
```

### Receive Updates
```json
{
  "type": "notifications",
  "data": {...},
  "timestamp": "2024-02-23T..."
}
```

## Background Jobs

### Verification Queue
- **Queue**: `verification`
- **Concurrency**: 5
- **Retry**: 3 attempts with exponential backoff

### Report Queue
- **Queue**: `reports`
- **Concurrency**: 3
- **Retry**: 2 attempts with fixed delay

## Caching Strategy

### Cache Keys
- `analysis:{query}:{model}:{language}` - Analysis results (30min)
- `analytics:{timeframe}` - Analytics data (5min)
- `ratelimit:{identifier}` - Rate limit counters (60s)
- `verification:{hash}` - Verification results (1hr)

### Cache Invalidation
- On new analysis: Invalidate analytics
- On settings update: Invalidate related caches
- On notification: No invalidation (append-only)

## Deployment

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

#### 1. Start PostgreSQL
```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=trustcalib \
  -e POSTGRES_DB=trustcalib \
  postgres:15-alpine
```

#### 2. Start Redis
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

#### 3. Start Python Service
```bash
cd services/verification
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 4. Start Next.js
```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Environment Variables

### Next.js
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
REDIS_HOST=localhost
REDIS_PORT=6379
PYTHON_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Python Service
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Monitoring

### Health Checks

- Next.js: `http://localhost:3000/api/health`
- Python: `http://localhost:8000/health`
- Redis: `redis-cli ping`
- PostgreSQL: `pg_isready`

### Logs

```bash
# Next.js
pnpm dev

# Python
uvicorn main:app --log-level info

# Docker
docker-compose logs -f [service-name]
```

### Metrics

- Average latency per service
- Queue depth and processing time
- Cache hit/miss ratio
- WebSocket connection count
- Database query performance

## Performance Optimization

### Caching
- LLM responses cached for 30 minutes
- Verification results cached for 1 hour
- Analytics cached for 5 minutes

### Async Processing
- Heavy verification runs in background
- Report generation queued
- Non-blocking WebSocket updates

### Connection Pooling
- PostgreSQL: Prisma connection pool
- Redis: ioredis connection reuse
- HTTP: Keep-alive connections

## Security

### Rate Limiting
- 10 requests per minute per IP
- Configurable per endpoint

### Data Validation
- Zod schemas for all inputs
- Pydantic models in Python
- SQL injection prevention (Prisma)

### CORS
- Configured in FastAPI
- Next.js API routes protected

## Scaling

### Horizontal Scaling
- Multiple Next.js instances behind load balancer
- Multiple Python workers
- Redis Cluster for high availability
- PostgreSQL read replicas

### Vertical Scaling
- Increase worker concurrency
- Larger Redis memory
- More PostgreSQL connections

## Troubleshooting

### Python Service Not Responding
```bash
# Check if running
curl http://localhost:8000/health

# Restart
docker-compose restart verification
```

### Redis Connection Failed
```bash
# Test connection
redis-cli ping

# Check logs
docker-compose logs redis
```

### WebSocket Not Connecting
- Check firewall rules
- Verify WebSocket path: `/ws`
- Check browser console for errors

### Queue Jobs Stuck
```bash
# Check Redis
redis-cli
> KEYS *

# Restart workers
docker-compose restart nextjs
```

## Future Enhancements

### Optional: Rust Microservice
For ultra-high-performance vector operations:

```rust
// High-speed trust deviation calculation
// Vector similarity at 10x speed
// Expose HTTP endpoint
```

### Planned Features
- GraphQL API
- gRPC between services
- Kafka for event streaming
- Elasticsearch for log aggregation
- Prometheus + Grafana monitoring

---

This polyglot architecture provides enterprise-grade scalability, performance, and maintainability.
