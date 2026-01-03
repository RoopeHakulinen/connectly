#!/bin/sh

# Exit on any error
set -e

echo "Starting Profinder application..."

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting NestJS application..."
exec node dist/main.js