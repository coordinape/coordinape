#!/bin/bash
set -e
SCRIPT_DIR="$(dirname $BASH_SOURCE[0])"
. $SCRIPT_DIR/../env.sh --ci

# parse arguments
OTHERARGS=()
while [[ "$#" > 0 ]]; do case $1 in
  # -f|--foo) FOO=1;; # example of boolean flag
  # -b|--bar) BAR="$2"; shift;; # example of flag with value
  -a|--all) ALL=1;;
  -c|--cypress) CYPRESS=1;;
  -i|--interactive) INTERACTIVE=1;;
  -j|--jest) JEST=1;;
  *) OTHERARGS+=($1);;
esac; shift; done

DOCKER_PROJECT_NAME=cape-ci-v2
DOCKER_CMD="docker compose -p $DOCKER_PROJECT_NAME"
PROJECT_ROOT=$SCRIPT_DIR/../..
GANACHE_PID=""
WEB_PID=""

start_services() {
  # start docker
  $DOCKER_CMD up -d

  # start ganache
  $SCRIPT_DIR/../../hardhat/scripts/start-ganache.sh -p $HARDHAT_GANACHE_PORT \
    --no-reuse & GANACHE_PID=$!

  # start web server
  if [ "$INTERACTIVE" ]; then
    ./scripts/serve.sh -p $LOCAL_WEB_PORT 2>&1 & WEB_PID=$!
  else
    ./scripts/serve.sh --coverage -p $LOCAL_WEB_PORT 2>&1 & WEB_PID=$!
  fi

  # stop everything when this script exits
  trap echo SIGINT
  trap stop_services EXIT

  sleep 1
  until \
    curl -s -o/dev/null http://localhost:$HARDHAT_GANACHE_PORT && \
    curl -s -o/dev/null http://localhost:$LOCAL_WEB_PORT && \
    curl -s -o/dev/null http://localhost:$LOCAL_HASURA_PORT; do
    echo "Waiting for services on ports $LOCAL_WEB_PORT, $LOCAL_HASURA_PORT, $HARDHAT_GANACHE_PORT..."
    sleep 4
    if [ -z "$(ps -p $GANACHE_PID -o pid=)" ]; then
      echo 'Ganache failed to start up.'
      exit 1
    fi
    if [ -z "$(ps -p $WEB_PID -o pid=)" ]; then
      echo 'Web server failed to start up.'
      exit 1
    fi
  done

  # handle race condition: if hasura started up before the web server, it needs
  # to reload metadata to enable the remote schema
  yarn hasura metadata reload
  
  echo "All services are ready."
}

stop_services() {
  echo Cleaning up...
  kill $GANACHE_PID || true
  kill $WEB_PID || true
  $DOCKER_CMD down -v -t 3
  wait
  exit
}

combine_coverage() {
  rm -r $PROJECT_ROOT/.nyc_output/*
  cp $PROJECT_ROOT/coverage-jest/coverage-final.json $PROJECT_ROOT/.nyc_output/jest.json
  cp $PROJECT_ROOT/coverage-cypress/coverage-final.json $PROJECT_ROOT/.nyc_output/cypress.json
  echo Combined coverage:
  yarn nyc report -r lcov -r text-summary --report-dir coverage
}

# can't use yarn seed-db-fresh -- it resets the environment
clean_hasura() {
  # adding this to PATH for ts-node
  export PATH=$PATH:$SCRIPT_DIR/../../node_modules/.bin
  $SCRIPT_DIR/../seed_hasura.sh --clean
}

if [ "${OTHERARGS[0]}" = "up" ]; then
  INTERACTIVE=1
  start_services
  wait

elif [ "${OTHERARGS[0]}" = "down" ]; then
  $DOCKER_CMD down -t 3

elif [ "${OTHERARGS[0]}" = "logs" ]; then
  $DOCKER_CMD logs -f ${OTHERARGS[@]:1}

elif [ "${OTHERARGS[0]}" = "test" ]; then
  if [ -z `docker compose ls -q | grep $DOCKER_PROJECT_NAME` ]; then
    start_services
  else
    echo "Detected running services. If this is unexpected, run \`manager.sh down\` to stop them."
  fi

  # TODO: support --all --interactive
  if [ "$ALL" ]; then
    JEST=1
    CYPRESS=1
  fi

  if [ "$JEST" ]; then
    if [ "$INTERACTIVE" ]; then
      yarn craco test --runInBand ${OTHERARGS[@]:1}
    else
      # FIXME find a way to make jest non-interactive other than setting CI=1
      CI=1 yarn craco test --runInBand --coverage ${OTHERARGS[@]:1}
    fi
  fi

  if [ "$CYPRESS" ]; then
    clean_hasura
    if [ "$INTERACTIVE" ]; then
      yarn cypress open ${OTHERARGS[@]:1} > /dev/null
    else
      yarn cypress run ${OTHERARGS[@]:1}
      yarn nyc report -r text-summary
    fi
  fi

  # combine coverage reports
  if [ "$ALL" ]; then
    combine_coverage
  fi

elif [ "${OTHERARGS[0]}" = "combine-coverage" ]; then
  combine_coverage
elif [ "${OTHERARGS[0]}" = "seed" ]; then
  clean_hasura

else
  echo "No command given. Expected one of: up, down, logs, test"
  exit 1
fi
