#!/bin/bash
set -e
SCRIPT_DIR="$(dirname $BASH_SOURCE[0])"


until curl -s -o/dev/null http://localhost:"$LOCAL_HASURA_PORT"; do
  sleep 1
  echo "waiting for hasura to start"
done

# Check if Ganache is running
if ! curl -s -o/dev/null http://localhost:"$HARDHAT_GANACHE_PORT"; then
  echo "Ganache is not running on port $HARDHAT_GANACHE_PORT."
  echo "Please start Ganache using pnpm hardhat:ganache"
  exit 1
fi

# Disable event triggers before re-seeding DB
./scripts/disable_triggers.sh

echo "Seeding..."
tsx ./scripts/db_seed_colinks.ts

# Re-enable event triggers post-seeding
# Don't apply metadata, because disable_cron will do it
echo "Re-enabling triggers and cron"
APPLY_METADATA=no ./scripts/enable_triggers.sh

# disable cron tasks to minimize unexpected CPU spikes
./scripts/disable_cron.sh

pnpm hasura metadata reload