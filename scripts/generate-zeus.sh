#!/bin/bash
set -e

set -o allexport
# shellcheck source=../.env
source .env
set +o allexport

GEN_PATH=./src/lib/gql

function generate() {
  # use the first argument as the path to move files to
  local MV_PATH=$GEN_PATH/$1; shift

  # pass the rest of the arguments to zeus
  (set -x; zeus "$HASURA_GRAPHQL_ENDPOINT"/v1/graphql "$GEN_PATH" --ts --rq "$@")
  test -d "$GEN_PATH"/zeus
  test -d "$MV_PATH" && rm -r "$MV_PATH"
  mv "$GEN_PATH"/zeus "$MV_PATH"



  # shamelessly borrowed from
  # https://gist.github.com/maxpoletaev/4ed25183427a2cd7e57a
  case "$OSTYPE" in
    darwin*)  PLATFORM="OSX" ;;
    linux*)   PLATFORM="LINUX" ;;
    bsd*)     PLATFORM="BSD" ;;
    *)        PLATFORM="UNKNOWN" ;;
  esac
  # mac sed needs sed -i '' -e
  # for other seds try removing -i '' -e
  # use `brew install gsed` on macos to get this
  if [[ "$PLATFORM" == "OSX" || "$PLATFORM" == "BSD" ]]; then
    sed -i "" 's,bigint"]:any,bigint"]:number,g' "$MV_PATH"/index.ts
    sed -i "" 's,bigint"]:unknown,bigint"]:number,g' "$MV_PATH"/index.ts
  elif [ "$PLATFORM" == "LINUX" ]; then
    sed -i 's,bigint"]:any,bigint"]:number,g' "$MV_PATH"/index.ts
    sed -i 's,bigint"]:unknown,bigint"]:number,g' "$MV_PATH"/index.ts
  else
    echo "unknown platform; exiting"
    exit 1
  fi
}

generate zeusHasuraAdmin -h x-hasura-admin-secret:$HASURA_GRAPHQL_ADMIN_SECRET
generate zeusUser -h x-hasura-role:user -h "authorization:generate"

# fix formatting of generated files
node_modules/.bin/prettier --write $GEN_PATH
