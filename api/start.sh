#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding demo data..."
npx tsx prisma/seed.ts
npx tsx prisma/seed-demo.ts

echo "Starting server..."
node dist/server.js
