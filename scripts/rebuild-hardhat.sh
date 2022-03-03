#!/bin/bash
set -e

FIND_DEV_PID="lsof -t -i:8545 -sTCP:LISTEN"

while [[ "$#" > 0 ]]; do case $1 in
  --full) FULL=1;;
esac; shift; done

if [ "$FULL" ]; then
  git submodule update --init --recursive
  yarn hardhat:install --frozen-lockfile
  yarn hardhat:compile

  echo "Starting node for auto deployment..."
  yarn hardhat:dev >/dev/null &

  while [ ! $(eval $FIND_DEV_PID) ]; do
    sleep 1
  done
  yarn hardhat:deploy
fi

yarn hardhat:codegen
yarn hardhat:build

if [ "$FULL" ]; then
  echo "Stopping node. The 'Command failed' messages that follow are normal."
  kill $(eval $FIND_DEV_PID)
fi

cd hardhat
yarn unlink >/dev/null 2>&1 || echo -n
yarn link
cd ..
yarn link @coordinape/hardhat

