#!/bin/bash
set -e

git submodule update --init --recursive
yarn hardhat:install --frozen-lockfile

# Set up the prisma `node_modules`
npx prisma generate

cd hardhat
yarn unlink >/dev/null 2>&1 || echo -n
yarn link
cd ..
yarn link @coordinape/hardhat

