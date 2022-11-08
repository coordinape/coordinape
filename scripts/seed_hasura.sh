#!/bin/bash
set -e
SCRIPT_DIR="${0%/*}"

PG_CXN="postgres://$LOCAL_POSTGRES_USER:$LOCAL_POSTGRES_PASSWORD@localhost:$LOCAL_POSTGRES_PORT/$LOCAL_POSTGRES_DATABASE"

CMD_TRUNCATE_ALL="DO \$\$ BEGIN
  EXECUTE (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
    FROM pg_class 
    WHERE relkind = 'r' 
    AND relnamespace = 'public'::regnamespace
    AND oid::regclass::text != 'vault_tx_types');
END\$\$"

until curl -s -o/dev/null http://localhost:"$LOCAL_HASURA_PORT"; do
  sleep 1
  echo "waiting for hasura to start"
done

# Disable event triggers before re-seeding DB
./scripts/disable_triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]; then
  echo "Truncating all tables..."
  if [ "$FAST_TRUNCATE" ]; then
    psql $PG_CXN -c "$CMD_TRUNCATE_ALL" >/dev/null
  else
    ts-node ./scripts/db_clean.ts
  fi
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
echo "Re-enabling triggers and cron"
./scripts/enable_triggers.sh

# disable cron tasks to minimize unexpected CPU spikes
./scripts/disable_cron.sh

yarn hasura $HASURA_ENV metadata reload