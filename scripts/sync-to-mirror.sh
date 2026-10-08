#!/bin/bash

# M-GRAT Mirror Sync Script
# Pulls latest from IBM GitHub main and pushes to github.com mirror
# Triggers Vercel deploy via hook after successful mirror push

REPO_DIR="/Users/ashishjohnmundu/Documents/GitHub/M-GRAT-beta-v3 "
VERCEL_HOOK="https://api.vercel.com/v1/integrations/deploy/prj_Bs9dSql6EzrYlMoeNcUIkZgBOi8X/aGctqHWhkj"
LOG_FILE="/Users/ashishjohnmundu/Documents/GitHub/M-GRAT-beta-v3 /scripts/sync.log"

echo "----------------------------------------" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting sync" >> "$LOG_FILE"

cd "$REPO_DIR" || { echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Could not cd to repo" >> "$LOG_FILE"; exit 1; }

# Pull latest from IBM GitHub
git fetch origin >> "$LOG_FILE" 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] No changes — already up to date" >> "$LOG_FILE"
  exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] New commits detected — pulling and mirroring" >> "$LOG_FILE"

# Pull
git pull origin main >> "$LOG_FILE" 2>&1

# Push to mirror
git push mirror main --force >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Mirror push successful" >> "$LOG_FILE"

  # Trigger Vercel deploy hook
  curl -s -X POST "$VERCEL_HOOK" >> "$LOG_FILE" 2>&1
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Vercel deploy hook triggered" >> "$LOG_FILE"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Mirror push failed" >> "$LOG_FILE"
fi
