#!/bin/bash
set -e

git submodule update --init --recursive
yarn hardhat:install --frozen-lockfile
./scripts/link-hardhat.sh