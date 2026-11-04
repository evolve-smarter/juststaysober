#!/bin/sh
# Runs inside the production image before the new version starts (Railway preDeployCommand).
set -e
cd /app
node deploy/check-env.mjs
node /migrate/node_modules/prisma/build/index.js migrate deploy --schema prisma/schema.prisma
node prisma/seed.mjs
