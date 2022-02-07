#!/bin/bash

# read .env, filtering out comments
export $(cat ../.env | sed 's/^#.*$//' | xargs)

exec ./node_modules/.bin/ganache \
  -p 8555 \
  -m coordinape \
  -f $ETHEREUM_RPC_URL \
  --fork.blockNumber $HARDHAT_FORK_BLOCK \
  --miner.defaultGasPrice 0x7735940000