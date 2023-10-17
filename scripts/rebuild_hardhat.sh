#!/bin/bash
set -e
SCRIPT_DIR="$(dirname $BASH_SOURCE[0])"
PORT=${HARDHAT_GANACHE_PORT:-8546}
FIND_GANACHE_PID="lsof -t -i:$PORT -sTCP:LISTEN"

while [[ "$#" > 0 ]]; do case $1 in
  --full) FULL=1;;
esac; shift; done

if [ "$FULL" ]; then
  # git submodule update --init --recursive
  yarn --cwd hardhat install --frozen-lockfile
  yarn --cwd hardhat compile

  echo "Starting Ganache..."
  yarn hardhat:ganache --no-reuse 2>&1 & PID=$!

  until curl -s -o/dev/null http://localhost:$PORT; do
    sleep 1
    if [ -z "$(ps -p $PID -o pid=)" ]; then
      echo "Ganache failed to start up."
      exit 1
    fi
  done

  echo ============================================
  echo Press Enter after you see \"Testchain is up\".
  echo ============================================
  read -p '' ok
fi

yarn --cwd hardhat codegen
yarn --cwd hardhat build

if [ "$FULL" ]; then
  echo "Stopping Ganache. The 'Command failed' message that follows is normal."
  kill $(eval $FIND_GANACHE_PID)
fi

$SCRIPT_DIR/link_hardhat.sh

echo "REBUILD HARDHAT COMPLETE!"
