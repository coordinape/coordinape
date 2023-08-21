#!/bin/bash
set -e

# need to unset NODE_OPTIONS since it confuses hasura cli
unset NODE_OPTIONS
SCRIPT_DIR="$(dirname $BASH_SOURCE[0])"

until curl -s -o/dev/null http://localhost:"$LOCAL_HASURA_PORT"; do
  sleep 1
  echo "waiting for hasura to start"
done

# Disable event triggers before re-seeding DB
./scripts/disable_triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]; then
  echo "Truncating all tables..."
  ts-node ./scripts/db_clean.ts
fi

if [ "$1" == "--QA" ]; then
  echo "Seeding QA data..."
  ts-node ./scripts/vault_QA_seed.ts
  ./scripts/enable_triggers.sh
  exit
fi

echo "Seeding..."
ts-node ./scripts/db_seed_test.ts

# Re-enable event triggers post-seeding
# Don't apply metadata, because disable_cron will do it
echo "Re-enabling triggers and cron"
APPLY_METADATA=no ./scripts/enable_triggers.sh

# disable cron tasks to minimize unexpected CPU spikes
./scripts/disable_cron.sh

yarn hasura metadata reload
