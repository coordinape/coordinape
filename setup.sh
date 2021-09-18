#!/bin/bash
set -e

echo "Configuring local env..."
brew install mysql
cp .env.example .env
yarn install

echo "Building api server..."
git clone -b ethan/buildkite-setup git@github.com:coordinape/coordinape-backend.git || true
cd coordinape-backend/
cp .env.example .env
docker-compose up -d
cd ..