#!/bin/bash
set -e
while [[ "$#" -gt 0 ]]; do case $1 in
  --coverage) COVERAGE=1;;
  -p|--port) PORT=$2;;
  *) OTHERARGS+=("$1");;
esac; shift; done

[ -z "$PORT" ] && PORT=3000

PROXY_PORT=$(( $RANDOM % 900 + 3100 ))

COVERAGE=$COVERAGE BROWSER=none PORT=$PROXY_PORT yarn craco start & CRACO_PID=$!
until curl -s -o/dev/null http://localhost:$PROXY_PORT; do
  sleep 1
done

if [ "$COVERAGE" ]; then
  yarn nyc --silent ts-node --swc scripts/serve_dev.ts $PORT $PROXY_PORT & API_PID=$!
else
  yarn nodemon -- scripts/serve_dev.ts $PORT $PROXY_PORT & API_PID=$!
fi

trap 'echo -e "\nWeb server (PIDs $CRACO_PID, $API_PID) is exiting..."; \
  echo `kill $CRACO_PID` >/dev/null; \
  echo `kill $API_PID` >/dev/null' EXIT

while true; do sleep 1; done