#!/bin/bash
set -e
while [[ "$#" -gt 0 ]]; do case $1 in
  -p|--port) PORT=$2;;
  *) OTHERARGS+=("$1");;
esac; shift; done

[ -z "$PORT" ] && PORT=3000

PROXY_PORT=$(( $RANDOM % 900 + 3100 ))

BROWSER=none PORT=$PROXY_PORT yarn craco start & CRACO_PID=$!
until curl -s -o/dev/null http://localhost:$PROXY_PORT; do
  sleep 1
done

yarn exec nodemon -- scripts/serve_dev.ts $PORT $PROXY_PORT & NODEMON_PID=$!

trap 'echo -e "\nWeb server (PIDs $CRACO_PID, $NODEMON_PID) is exiting..."; \
  echo `kill $CRACO_PID` >/dev/null; \
  echo `kill $NODEMON_PID` >/dev/null' EXIT

while true; do sleep 1; done