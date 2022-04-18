#!/bin/bash


# Disable event triggers before re-seeding DB
./scripts/disable-triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]
  then ts-node ./scripts/db-clean.ts
fi
ts-node ./scripts/db-seed.ts
ts-node ./scripts/db-add-me.ts

# Re-enable event triggers post-seeding
./scripts/enable-triggers.sh

# disable cron tasks to minimize unexpected CPU spikes
./scripts/disable_cron.sh
