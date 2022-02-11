#!/bin/bash
set -e
export CI=1

if [ ! "$HARDHAT_FORK_BLOCK" ]; then
  echo
  echo "------------------------------------------------------------------------"
  echo "  HARDHAT_FORK_BLOCK is not set; forking mainnet from latest block."
  echo "  This may make tests fail. For best results, set HARDHAT_FORK_BLOCK."
  echo "  This requires ETHEREUM_RPC_URL to be set to an archive node."
  echo "------------------------------------------------------------------------"
  echo
fi

yarn --cwd hardhat test
craco test --coverage