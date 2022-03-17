#!/bin/bash


# Disable event triggers before re-seeding DB
./scripts/disable-triggers.sh

# Re-seed database
yarn db-clean && yarn db-seed && yarn db-add-me

# Re-enable event triggers post-seeding
./scripts/enable-triggers.sh

