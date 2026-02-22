#!/bin/bash

echo "🚀 Starting Trust Calibration Layer Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your OPENAI_API_KEY"
    exit 1
fi

# Start services with Docker Compose
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U trustcalib > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

# Check Python service
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Python Verification Service is ready"
else
    echo "⚠️  Python Verification Service is starting..."
fi

# Check Next.js
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Next.js Application is ready"
else
    echo "⚠️  Next.js Application is starting..."
fi

echo ""
echo "🎉 Services are starting up!"
echo ""
echo "📊 Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Python API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
