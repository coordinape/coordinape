#!/bin/bash

# This script disables cron tasks in your local dev environment while
# resetting the metadata after execution.
# This means that re-enabling cron tasks is as simple as running
# `yarn hasura metadata apply`
#
# This is done with the intention that most developers do not care about
# cron tasks running automatically, but also don't want to manage anything
# related to cron tasks in their git diffs, and potentially push a change
# that could disable cron tasks up to remote

CRON_FILE=./hasura/metadata/cron_triggers.yaml
BACKUP=$CRON_FILE.bak

function toggle_cron () {
  if [[ -e $BACKUP ]]
  then
    mv $BACKUP $CRON_FILE
  else
    sed -i'.bak' -e s/^/#/ "$CRON_FILE"
  fi
}

toggle_cron

yarn hasura metadata apply

toggle_cron
