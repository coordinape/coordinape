#!/bin/bash
set -e
while [[ "$#" -gt 0 ]]; do case $1 in
  --coverage) COVERAGE=1;;
  -p|--port) PORT=$2;;
  *) OTHERARGS+=("$1");;
esac; shift; done

[ -z "$PORT" ] && PORT=3000

SCRIPT_DIR="$(dirname $BASH_SOURCE[0])"
BIN=$SCRIPT_DIR/../node_modules/.bin
PROXY_PORT=$(( $RANDOM % 900 + 3100 ))

COVERAGE=$COVERAGE BROWSER=none PORT=$PROXY_PORT $BIN/craco start & CRACO_PID=$!
until curl -s -o/dev/null http://localhost:$PROXY_PORT; do
  sleep 1
done

if [ "$COVERAGE" ]; then
  $BIN/nyc --silent $BIN/ts-node --swc scripts/serve_dev.ts $PORT $PROXY_PORT & API_PID=$!
else
  $BIN/nodemon -- scripts/serve_dev.ts $PORT $PROXY_PORT & API_PID=$!
fi

cleanup() {
  echo "Web server is exiting... ($CRACO_PID, $API_PID)"
  kill $CRACO_PID || true
  kill $API_PID || true

  # this child process frequently doesn't exit properly
  ORPHAN_PID=`test $(which lsof) && lsof -t -iTCP:$PROXY_PORT`
  if [ "$ORPHAN_PID" ]; then 
    echo "Removing orphaned craco process... ($ORPHAN_PID)"
    kill $ORPHAN_PID
  fi
}

trap echo SIGINT
trap cleanup EXIT

while true; do
  sleep 5
  if [ -z "$(ps -p $API_PID -o pid=)" ]; then
    echo "API server process crashed! ($API_PID)"
    exit 1
  fi
  if [ -z "$(ps -p $CRACO_PID -o pid=)" ]; then
    echo "Craco crashed! ($CRACO_PID)"
    exit 1
  fi
done