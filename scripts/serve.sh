#!/bin/bash
set -e
while [[ "$#" -gt 0 ]]; do case $1 in
  -p|--port) PORT=$2;;
  *) OTHERARGS+=("$1");;
esac; shift; done

[ -z "$PORT" ] && PORT=3000

PROXY_PORT=$(( $RANDOM % 900 + 3100 ))

BROWSER=none PORT=$PROXY_PORT yarn craco start >/dev/null & CRACO_PID=$!

trap 'kill $CRACO_PID' EXIT

until curl -s -o/dev/null http://localhost:$PROXY_PORT; do
  sleep 1
  if [ -z "$(ps -p $CRACO_PID -o pid=)" ]; then
    echo "dev server failed to start up."
    exit 1
  fi
done

yarn exec nodemon \
  -- scripts/serve_dev.ts $PORT $PROXY_PORT
