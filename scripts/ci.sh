#!/bin/bash
set -e
export CI=1

EXECARGS=()
while [[ "$#" > 0 ]]; do case $1 in
  -v|--verbose-hasura) VERBOSE=1;;
  *) EXECARGS+=($1);;
esac; shift; done

if [ ! "$HARDHAT_FORK_BLOCK" ]; then
  echo
  echo "------------------------------------------------------------------------"
  echo "  HARDHAT_FORK_BLOCK is not set; forking mainnet from latest block."
  echo "  This may make tests fail. For best results, set HARDHAT_FORK_BLOCK."
  echo "  This requires ETHEREUM_RPC_URL to be set to an archive node."
  echo "------------------------------------------------------------------------"
  echo
fi

# TODO: skip this if it's already running
echo "Starting Hasura on port ${CI_HASURA_PORT}..."

CMD=(docker compose --profile ci run --rm --service-ports graphql-engine-ci)  

if [ "$VERBOSE" ]; then
  "${CMD[@]}" 2>&1 & PID=$!
else
  LOGFILE=${TMPDIR:-.}/hasura-ci-$(date +%s).log
  echo "Writing output to" $LOGFILE
  "${CMD[@]}" > $LOGFILE 2>&1 & PID=$!
fi


sleep 5
until curl -s -o/dev/null http://localhost:$CI_HASURA_PORT; do
  sleep 1
  if [ -z "$(ps -p $PID -o pid=)" ]; then
    echo "Hasura failed to start up."
    exit 1
  fi
done

# Kill Hasura when this script exits
trap "kill $PID" EXIT

craco test --coverage
yarn --cwd hardhat test