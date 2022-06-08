#!/bin/bash

# Setup and serve a CI-focused frontend
# run these in another console
# yarn hardhat:ganache &> /dev/null &
# docker compose --profile ci up -d  --force-recreate
set -ex
echo "Warning! this script touches your .env file. Press enter if you know what you're doing"
echo "Otherwise exit now with Ctrl-C"
read
mv .env .env.orig
cp .ci.env .env
trap 'rm .env && mv .env.orig .env' EXIT
yarn
yarn setup
source .env
yarn db-seed-fresh
vercel dev -l "$CI_VERCEL_PORT"
