#!/bin/sh
# Database backup for the VPS stack. Run from the deploy/ folder (cron example in HOSTINGER.md).
# IMPORTANT: a backup that lives only on this server is lost if the server is lost. Copy the files
# off the server too (Hostinger snapshot, or rclone to cloud storage). Keeps the newest 14 dumps.
set -e
cd "$(dirname "$0")"
mkdir -p backups
f="backups/jss-$(date +%Y%m%d-%H%M%S).sql.gz"
docker compose exec -T db pg_dump -U jss jss | gzip > "$f"
test -s "$f" || { echo "backup is empty, failing"; rm -f "$f"; exit 1; }
ls -1t backups/jss-*.sql.gz | tail -n +15 | xargs -r rm --
echo "wrote $f"
