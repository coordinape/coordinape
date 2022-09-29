#!/bin/bash
set -e
SCRIPT_DIR="${0%/*}"

# read .env, filtering out comments
if [ -z "$CI" ]; then
  DOTENV_FILE=$SCRIPT_DIR/../.env
else
  DOTENV_FILE=$SCRIPT_DIR/../.ci.env
fi

if [ -f "$DOTENV_FILE" ]; then
  export $(cat $DOTENV_FILE | sed 's/^#.*$//' | xargs)
fi

if [ -z "$CI" ]; then
  PORT=$LOCAL_HASURA_PORT
  POSTGRES_PORT=$LOCAL_POSTGRES_PORT
else
  PORT=$CI_HASURA_PORT
  POSTGRES_PORT=$CI_POSTGRES_PORT
fi

PG_CXN="postgres://$LOCAL_POSTGRES_USER:$LOCAL_POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$LOCAL_POSTGRES_DATABASE"

CMD_TRUNCATE_ALL="DO \$\$ BEGIN
  EXECUTE (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
    FROM pg_class 
    WHERE relkind = 'r' 
    AND relnamespace = 'public'::regnamespace
    AND oid::regclass::text != 'vault_tx_types');
END\$\$"

until curl -s -o/dev/null http://localhost:"$PORT"; do
  sleep 1
  echo "waiting for hasura to start"
done

# Disable event triggers before re-seeding DB
./scripts/disable_triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]; then
  echo "Truncating all tables..."
  # ts-node ./scripts/db_clean.ts
  psql $PG_CXN -c "$CMD_TRUNCATE_ALL" >/dev/null
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
