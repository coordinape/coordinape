#!/bin/bash
set -e

git submodule update --init --recursive
yarn --cwd hardhat install --frozen-lockfile
./scripts/link-hardhat.sh