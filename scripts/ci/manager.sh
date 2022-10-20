#!/bin/bash
set -e
SCRIPT_DIR="${0%/*}"
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
DOCKER_CMD="docker compose --profile dev -p $DOCKER_PROJECT_NAME"

start_services() {
  # start docker
  $DOCKER_CMD up -d
  
  # start ganache
  $SCRIPT_DIR/../../hardhat/scripts/start-ganache.sh -p $HARDHAT_GANACHE_PORT \
    --no-reuse & GANACHE_PID=$!

  # start web server
  ./scripts/serve.sh -p $LOCAL_WEB_PORT 2>&1 & WEB_PID=$!

  # stop everything when this script exits
  trap 'echo `kill $GANACHE_PID` >/dev/null; \
    echo `kill $WEB_PID` >/dev/null; \
    $DOCKER_CMD down' EXIT

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
  echo "All services are ready."
}

if [ "${OTHERARGS[0]}" = "up" ]; then
  start_services
  while true; do read; done

elif [ "${OTHERARGS[0]}" = "down" ]; then
  $DOCKER_CMD down

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
    # can't use yarn seed-db-fresh -- it resets the environment
    $SCRIPT_DIR/../seed_hasura.sh --clean
    if [ "$INTERACTIVE" ]; then
      yarn cypress open ${OTHERARGS[@]:1} > /dev/null
    else
      yarn cypress run ${OTHERARGS[@]:1}
    fi
  fi

else
  echo "No command given. Expected one of: up, down, logs, test"
fi
