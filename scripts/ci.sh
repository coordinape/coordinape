#!/bin/bash
set -e
export CI=1

OTHERARGS=()
while [[ "$#" -gt 0 ]]; do case $1 in
  --cypress-only) CYPRESS_ONLY=1;;
  --local) LOCAL=1;;
  -v|--verbose-hasura) VERBOSE=1;;
  *) OTHERARGS+=("$1");;
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

echo "Starting Hasura on port ${CI_HASURA_PORT}..."

CMD=(docker compose --profile ci -p coordinape-ci up)

if [ "$VERBOSE" ]; then
  "${CMD[@]}" 2>&1 & PID=$!
else
  LOGFILE=${TMPDIR:-.}/hasura-ci-$(date +%s).log
  echo "Writing output to" "$LOGFILE"
  "${CMD[@]}" > "$LOGFILE" 2>&1 & PID=$!
fi

export NODE_HASURA_URL=http://localhost:"$CI_HASURA_PORT"/v1/graphql
WEB_CMD=(yarn start -p "$CI_WEB_PORT")

"${WEB_CMD[@]}" 2>&1 & WEB_PID=$!

# Kill Hasura & web server when this script exits
trap 'unset CI; kill $WEB_PID; docker compose --profile ci -p coordinape-ci down -v || true' EXIT

sleep 5
until curl -s -o/dev/null http://localhost:"$CI_HASURA_PORT"; do
  sleep 1
  if [ -z "$(ps -p $PID -o pid=)" ]; then
    echo "Hasura failed to start up."
    exit 1
  fi
done

until curl -s -o/dev/null http://localhost:"$CI_WEB_PORT"; do
  sleep 1
  if [ -z "$(ps -p $WEB_PID -o pid=)" ]; then
    echo "Web server failed to start up."
    exit 1
  fi
done

yarn db-seed-fresh

if [ -z "$CYPRESS_ONLY" ]; then
  craco test --runInBand --coverage

  # these are redundant with jest & cypress tests now
  # yarn --cwd hardhat test
fi

if [ -z "$LOCAL" ]; then
  yarn cypress run ${OTHERARGS[@]}
else
  yarn cypress open > /dev/null
fi
