# Running JustStaySober on a Hostinger VPS

**Use a Hostinger VPS with Docker, not Hostinger's Node.js web-app hosting.** The app needs
PostgreSQL; the Node.js hosting advertises MySQL (vendor marketing, not verified). The steps below
assume a VPS using Hostinger's "Ubuntu 24.04 with Docker" template (also vendor-described).
Items marked **UNVERIFIED** were not tested in this repo's cloud sandbox.

## Be honest about the trade-off
On a VPS **you** are the system administrator: security updates, backups, restarts, monitoring.
This app holds sensitive recovery information. If nobody will do that work weekly, use a managed
host instead and keep Hostinger for the domain.

## One-time setup
1. **VPS size:** UNVERIFIED. Building the app image needs a few GB of RAM; if the build runs out of
   memory, pick a bigger plan or build elsewhere and copy the image.
2. **DNS:** at Hostinger DNS, add an `A` record for your domain (and `www`) pointing to the VPS IP.
3. **Lock the server down:** SSH keys only (turn off password login); firewall allowing only
   ports 22, 80, 443 (`ufw allow 22,80,443/tcp && ufw enable`); turn on automatic security updates
   (`apt install unattended-upgrades`). The database is not published to the internet by this setup.
4. **Get the code:** `git clone` the repository (private repos need a deploy key or token),
   check out the branch/tag you want to run.
5. **Configure:** `cd deploy && cp .env.example .env && chmod 600 .env`, then fill every value
   (see `../DEPLOY.md` section 2 for where each key comes from). Never commit `.env`.
6. **Start:** `docker compose up -d --build`. The app container checks settings, applies database
   migrations, loads starter data, then starts. Watch with `docker compose logs -f app`.
   Caddy fetches the HTTPS certificate automatically once DNS points at the server.
7. **Smoke test:** follow `../DEPLOY.md` section 4.

## Backups (do this before real users)
- `deploy/backup.sh` writes a compressed database dump and keeps the newest 14.
- Daily at 3am: `0 3 * * * cd /path/to/repo/deploy && ./backup.sh >> backup.log 2>&1` (crontab -e).
- **Copy dumps off the server** (Hostinger snapshots/backups if your plan has them, or rclone to
  cloud storage). A backup on the same disk is not a backup.
- **Test a restore once:** `gunzip -c backups/FILE.sql.gz | docker compose exec -T db psql -U jss jss`
  into a scratch database before you need it.

## Updating
`git pull && cd deploy && docker compose up -d --build`. Take a backup first if
`prisma/migrations` changed. To roll back, check out the previous version and rebuild; migrations
are not automatically reversible.

## Monitoring
Point a free uptime monitor at `https://YOUR-DOMAIN/api/health` and have it email you. Check
`docker compose ps` and disk space (`df -h`) weekly.
