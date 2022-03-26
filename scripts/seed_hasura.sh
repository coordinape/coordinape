#!/bin/bash


# Disable event triggers before re-seeding DB
./scripts/disable-triggers.sh

# Re-seed database
if [ "$1" == "--clean" ]
  then node ./scripts/tsrun.mjs ./scripts/db-clean.ts
fi
node ./scripts/tsrun.mjs ./scripts/db-seed.ts
node ./scripts/tsrun.mjs ./scripts/db-add-me.ts

# Re-enable event triggers post-seeding
./scripts/enable-triggers.sh

