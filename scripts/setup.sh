#!/bin/bash
set -e

git submodule update --init --recursive
pnpm --dir=hardhat install --frozen-lockfile
