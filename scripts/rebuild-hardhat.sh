#!/bin/bash
set -e

FIND_DEV_PID="lsof -t -i:8545 -sTCP:LISTEN"

git submodule update --init --recursive
yarn hardhat:install --frozen-lockfile
yarn hardhat:compile

echo "Starting node for auto deployment..."
yarn hardhat:dev >/dev/null &

while [ ! $(eval $FIND_DEV_PID) ]; do
  sleep 1
done

yarn hardhat:deploy
yarn hardhat:codegen
yarn hardhat:build

echo "Stopping node. The 'Command failed' messages that follow are normal."
kill $(eval $FIND_DEV_PID)

cd hardhat
yarn unlink >/dev/null 2>&1 || echo -n
yarn link
cd ..
yarn link @coordinape/hardhat

