#!/bin/bash
#
# adapted from https://github.com/makerdao/testchain/blob/dai.js/scripts/launch

set -e
set -o pipefail
SCRIPT_DIR="${0%/*}"

CHAIN_ID=${HARDHAT_GANACHE_CHAIN_ID:-1338}
PORT=$HARDHAT_GANACHE_PORT
VERBOSE=$HARDHAT_GANACHE_VERBOSE

# parse arguments
EXECARGS=()
while [[ "$#" > 0 ]]; do case $1 in
  --exec) EXEC=1;;
  --no-deploy) NO_DEPLOY=1;;
  --no-mint) NO_MINT=1;;
  --no-reuse) NO_REUSE=1;;
  -p|--port) PORT="$2"; shift;;
  -v|--verbose) VERBOSE=1;;
  *) EXECARGS+=($1);;
esac; shift; done

if [ ! "$PORT" ]; then
  echo "Missing argument -p|--port; can't continue."
  exit 1
fi

if [ ! "$HARDHAT_ARCHIVE_RPC_URL" ]; then
  echo "Env doesn't have HARDHAT_ARCHIVE_RPC_URL set; can't continue."
  exit 1
fi

if nc -z 127.0.0.1 $PORT >/dev/null 2>&1; then
  if [ "$NO_REUSE" ]; then
    echo "Error! Testchain is already running at port $PORT but --no-reuse was specified."
    exit 1
  fi
  
  echo "Using existing testchain at port $PORT."

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
      --chain.chainId $CHAIN_ID
      --port $PORT
      --mnemonic "test test test test test test test test test test test junk"
      --fork.url $HARDHAT_ARCHIVE_RPC_URL
      --fork.blockNumber ${HARDHAT_FORK_BLOCK:-"13500000"}
      --miner.defaultGasPrice 0x22665a1644
      --wallet.totalAccounts 20
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
  cleanup() {
    echo "Ganache is exiting... ($PID)"
    kill $PID
    hard_kill
  }

  hard_kill() {
      sleep 1
      if ps -p $PID >/dev/null; then
        echo "Ganache did not stop after 1 second."
        echo "Stopping ganache forcefully!"
        kill -9 $PID
      fi
  }

  trap echo SIGINT
  trap cleanup EXIT

  if [ ! "$NO_DEPLOY" ]; then
    FORK_MAINNET=1 yarn --cwd hardhat deploy --network ci --reset | awk '{ print "[ganache: deploy]", $0 }'
    FORK_MAINNET=1 yarn --cwd hardhat hardhat run scripts/manage/cosoul_setup_options.ts --network ci | awk '{ print "[ganache: run]", $0 }'
  fi

  if [ ! "$NO_MINT" ]; then
    yarn --cwd hardhat hardhat mint --address $LOCAL_SEED_ADDRESS --amount 1 --token ETH --network ci
  fi

  if [ "$EXEC" ]; then
    # Run the command given
    ${EXECARGS[@]}
  else
    # The testnet will continue to run until the user shuts it down.
    echo "Testchain is up. Press Ctrl-C to stop it."
    wait
  fi
fi
