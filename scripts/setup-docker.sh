#!/bin/bash
set -e

docker-compose --version
hasura version
echo ""
echo "Hasura CLI v2.2 > is required"
echo "checkity check yourself"
echo ""

echo "Starting up the docker containers."
docker-compose down -v
docker-compose up --force-recreate -d