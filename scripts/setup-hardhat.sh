#!/bin/bash
set -e

git submodule update --init --recursive
yarn hardhat:install --frozen-lockfile
yarn hardhat:compile
yarn hardhat:dev > /dev/null 2>&1 &

while [ ! $(lsof -t -i:"8545") ]; do
  sleep 1
done

yarn --cwd ./hardhat hardhat deploy --network localhost
yarn hardhat:codegen
yarn hardhat:build

kill $(lsof -t -i:"8545")

cd hardhat
yarn link
cd ..
yarn link @coordinape/hardhat

