#!/bin/bash

# this script should be the single point of environment variable management
#
# environment variable configuration should happen once, at the beginning,
# not in a bunch of different places. calling dotenv in multiple places in the
# same codebase should be avoided.

set -e

# don't overwrite env if re-entering script
if [ -z "$CAPE_ENV_LOADED" ]; then
  export CAPE_ENV_LOADED=1

  DOTENV_FILE=$(dirname $BASH_SOURCE[0])/../.env
  if [ -f "$DOTENV_FILE" ]; then
    export $(cat $DOTENV_FILE | sed 's/^#.*$//' | xargs)
  fi
fi

# parse arguments
OTHERARGS=()
while [[ "$#" > 0 ]]; do case $1 in
  --ci) SET_CI_VARS=1;;
  *) OTHERARGS+=($1);;
esac; shift; done

if [ "$SET_CI_VARS" ]; then
  # backwards compatibility
  if [ -z "$HARDHAT_ARCHIVE_RPC_URL" ]; then
    echo '-----------------------------------------------------------------------'
    echo 'Please rename ETHEREUM_RPC_URL in your .env to HARDHAT_ARCHIVE_RPC_URL.'
    echo '-----------------------------------------------------------------------'
    export HARDHAT_ARCHIVE_RPC_URL=$ETHEREUM_RPC_URL
  fi
  export NODE_ENV=development
  export LOCAL_LOCALSTACK_PORT_RANGE="4666-4683"
  export LOCAL_HASURA_PORT=8087
  export LOCAL_POSTGRES_PORT=5437
  export LOCAL_WEB_PORT=3007
  export HARDHAT_GANACHE_PORT=8547
  export HASURA_EVENT_SECRET=event-secret
  export HASURA_GRAPHQL_ADMIN_SECRET=admin-secret
  export HASURA_GRAPHQL_ENDPOINT=http://localhost:${LOCAL_HASURA_PORT}
  export NODE_HASURA_URL=http://localhost:${LOCAL_HASURA_PORT}/v1/graphql
  export REACT_APP_HASURA_URL=http://localhost:${LOCAL_HASURA_PORT}/v1/graphql
  export REACT_APP_S3_BASE_URL=http://s3.localhost.localstack.cloud:4666
  export IMAGES_AWS_ENDPOINT=http://s3.localhost.localstack.cloud:4666
  export BACKFILL_TO="$(date +%Y-%m-01)"
  export PGIVE_CIRCLE_MAX_PER_CRON=20
  export MIXPANEL_PROJECT_TOKEN=mock-mixpanel-token
  export REACT_APP_FEATURE_FLAG_ORG_VIEW=true
fi

if [ "$OTHERARGS" ]; then
  ${OTHERARGS[@]}
fi
