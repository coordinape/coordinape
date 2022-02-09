#!/bin/bash
#
# adapted from https://github.com/makerdao/testchain/blob/dai.js/scripts/launch

set -e
SCRIPT_DIR="${0%/*}"

# read .env, filtering out comments
DOTENV_FILE=$SCRIPT_DIR/../../.env 
if [ -f "$DOTENV_FILE" ]; then
  export $(cat $DOTENV_FILE | sed 's/^#.*$//' | xargs)
fi

PORT=$HARDHAT_GANACHE_PORT
VERBOSE=$HARDHAT_GANACHE_VERBOSE

# parse arguments
EXECARGS=()
while [[ "$#" > 0 ]]; do case $1 in
  --exec) EXEC=1;;
  -p|--port) PORT="$2"; shift;;
  -v|--verbose) VERBOSE=1;;
  *) EXECARGS+=($1);;
esac; shift; done

if [ ! "$PORT" ]; then
  echo "Missing argument -p|--port; can't continue."
  exit 1
fi

if nc -z 127.0.0.1 $PORT; then
  echo "Testchain is already running on port $PORT."

  if [ "$EXEC" ]; then
    # Run the command given
    ${EXECARGS[@]}
  else
    echo "No command provided with --exec; nothing to do."
    exit 1
  fi
else
  echo "Starting ganache..."

  GANACHE_ARGS=(
    $SCRIPT_DIR/../node_modules/.bin/ganache
      -p $PORT
      -m coordinape
      -f $ETHEREUM_RPC_URL
      --fork.blockNumber $HARDHAT_FORK_BLOCK
      --miner.defaultGasPrice 0x7735940000
  )

  if [ "$VERBOSE" ]; then
    "${GANACHE_ARGS[@]}" 2>&1 & PID=$!
  else
    LOGFILE=${TMPDIR:-.}/ganache-$(date +%s).log
    echo "Writing output to" $LOGFILE
    "${GANACHE_ARGS[@]}" > $LOGFILE 2>&1 & PID=$!
  fi
  
  # Wait for the testnet to become responsive
  sleep 5
  until curl -s -o/dev/null http://localhost:$PORT; do
    sleep 1
    if [ -z "$(ps -p $PID -o pid=)" ]; then
      echo "Ganache failed to start up."
      exit 1
    fi
  done

  # Kill the testnet when this script exits
  trap "kill $PID" EXIT

  if [ "$EXEC" ]; then
    # Run the command given
    ${EXECARGS[@]}
  else
    # The testnet will continue to run until the user shuts it down.
    echo "Press Ctrl-C to stop the testchain."
    while true; do read; done
  fi
fi

