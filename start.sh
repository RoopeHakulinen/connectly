#!/bin/sh

# Exit on any error
set -e

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting NestJS application..."
echo "Current Directory: $(pwd)"
echo "Listing /home/node/dist:"
ls -la /home/node/dist
echo "Finding index.html..."
find /home/node -name "index.html"
exec node dist/src/main.js