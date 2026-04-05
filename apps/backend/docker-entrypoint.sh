#!/bin/sh
set -eu

echo "Running Prisma schema sync..."
npx prisma db push --skip-generate

echo "Starting backend..."
exec node dist/index.js
