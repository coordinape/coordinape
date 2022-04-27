#!/bin/bash


# Disable event triggers before re-seeding DB
./scripts/disable_triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]
  then ts-node ./scripts/db_clean.ts
fi

ts-node ./scripts/db_seed_test.ts

# Re-enable event triggers post-seeding
./scripts/enable_triggers.sh

# disable cron tasks to minimize unexpected CPU spikes
./scripts/disable_cron.sh
