#!/bin/bash

echo "🚀 Setting up Project2 - Order Management System"
echo "=================================================="

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo "🐳 Building and starting Docker services..."
docker-compose up -d --build

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📊 Services:"
echo "   - Project2 API: http://localhost:3000"
echo "   - MySQL Database: localhost:3306"
echo ""
echo "🔗 Quick Links:"
echo "   - Health Check: http://localhost:3000/health"
echo "   - API Documentation: http://localhost:3000/api/v1/orders"
echo ""
echo "🧪 Test the API:"
echo "   node test-api.js"
echo ""
echo "📋 Useful Commands:"
echo "   - View logs: docker-compose logs -f project2"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart" 