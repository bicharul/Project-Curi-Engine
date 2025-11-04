#!/bin/bash

echo "🚀 Setting up Curi Engine - Motorcycle Theft Prevention Platform"

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/media backend/staticfiles

# Set up environment files
echo "🔧 Setting up environment configuration..."

# Backend environment
cat > backend/.env << EOL
DEBUG=True
SECRET_KEY=curi-engine-local-setup-2024
DB_NAME=curi_engine
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=db
DB_PORT=5432
ELASTICSEARCH_HOST=elasticsearch:9200
EOL

# Frontend environment
cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Curi Engine
EOL

echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Run migrations and setup
echo "📦 Running database migrations..."
docker-compose exec backend python manage.py migrate

echo "🔍 Creating search indexes..."
docker-compose exec backend python manage.py search_index --rebuild -f

echo "👤 Creating superuser..."
docker-compose exec backend python manage.py createsuperuser --noinput --username admin --email admin@curiengine.com || true

echo "✅ Setup complete!"
echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Admin Panel: http://localhost:8000/admin"
echo "   Elasticsearch: http://localhost:9200"
echo ""
echo "🔧 To stop the application: docker-compose down"
echo "🔧 To view logs: docker-compose logs -f"
