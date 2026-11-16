#!/bin/bash
# Brings up a throwaway local Postgres (port 5433) + the built app (port 3000) for smoke tests in a
# Linux cloud container (needs root + postgresql-16 server binaries). TEST DATA ONLY.
# Usage: scripts/cloud-test-env.sh [--build]   (--build runs `npm run build` first)
set -e
cd "$(dirname "$0")/.."
D=/var/tmp/jsspg
PGBIN=/usr/lib/postgresql/16/bin
export DATABASE_URL="postgresql://postgres@localhost:5433/jss" AUTH_SECRET=testsecret AUTH_URL=http://localhost:3000 AUTH_TRUST_HOST=true ADMIN_EMAILS=admin@example.com

if [ ! -d "$D/data" ]; then
  mkdir -p $D && chown postgres:postgres $D
  su postgres -c "$PGBIN/initdb -D $D/data -A trust >/dev/null"
fi
psql -h /tmp -p 5433 -U postgres postgres -qAt -c "select 1" >/dev/null 2>&1 || \
  su postgres -c "$PGBIN/pg_ctl -D $D/data -o '-p 5433 -k /tmp' -l $D/log start" >/dev/null
sleep 2
psql -h /tmp -p 5433 -U postgres -qAt -c "select 1 from pg_database where datname='jss'" | grep -q 1 || psql -h /tmp -p 5433 -U postgres -qAt -c "create database jss" >/dev/null
npx prisma migrate deploy >/dev/null
node prisma/seed.mjs >/dev/null

if [ "$1" = "--build" ] || [ ! -d .next ]; then rm -rf .next; npm run build >/tmp/jss-build.log 2>&1 || { tail -20 /tmp/jss-build.log; exit 1; }; fi
curl -s -m 2 localhost:3000/api/health >/dev/null || (nohup npx next start -p 3000 >/tmp/jss-next.log 2>&1 &)
for i in $(seq 1 20); do curl -s -m 2 localhost:3000/api/health | grep -q ok && break; sleep 1; done
curl -s localhost:3000/api/health; echo
