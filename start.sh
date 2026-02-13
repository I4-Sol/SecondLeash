#!/bin/bash
# SecondLeash Quick Start Script

echo "🐕 SecondLeash - Dog Shelter Management Platform"
echo "================================================"
echo ""
echo "Starting all services with Docker Compose..."
echo ""

# Start Docker Compose
docker compose up --build -d

echo ""
echo "✅ Services are starting!"
echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "Running database migrations and seeds..."
docker compose exec -T api sh -c "cd /app/infra/db && npx prisma generate && npx prisma migrate deploy && npm run seed"

echo ""
echo "🎉 SecondLeash is ready!"
echo ""
echo "Access the application:"
echo "  Web App: http://localhost:5173"
echo "  API: http://localhost:3000"
echo ""
echo "Login credentials:"
echo "  Shelter Admin: shelter@secondleash.com / Shelter123!"
echo "  Staff: staff@secondleash.com / Staff123!"
echo "  Volunteer: volunteer@secondleash.com / Volunteer123!"
echo ""
echo "To stop: docker compose down"
echo "To view logs: docker compose logs -f"
