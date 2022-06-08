#!/bin/bash
set -e
SCRIPT_DIR="${0%/*}"

# read .env, filtering out comments
DOTENV_FILE=$SCRIPT_DIR/../.env 
if [ -f "$DOTENV_FILE" ]; then
  export $(cat $DOTENV_FILE | sed 's/^#.*$//' | xargs)
fi

PG_CXN="postgres://$LOCAL_POSTGRES_USER:$LOCAL_POSTGRES_PASSWORD@localhost/$LOCAL_POSTGRES_DATABASE"

CMD_TRUNCATE_ALL="DO \$\$ BEGIN
  EXECUTE (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE' 
    FROM pg_class WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace);
END\$\$"

# Disable event triggers before re-seeding DB
./scripts/disable_triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]; then 
  echo "Truncating all tables..."
  ts-node ./scripts/db_clean.ts
  # psql $PG_CXN -c "$CMD_TRUNCATE_ALL" >/dev/null
fi

echo "Seeding..."
ts-node ./scripts/db_seed_test.ts

# Re-enable event triggers post-seeding
./scripts/enable_triggers.sh

# disable cron tasks to minimize unexpected CPU spikes
./scripts/disable_cron.sh
