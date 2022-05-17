#!/bin/bash
set -e
set -o allexport
# shellcheck source=../.env
source .env
set +o allexport

ADMIN_PATH=./api-lib/gql/__generated__
USER_PATH=./src/lib/gql/__generated__

function generate() {
  # use the first argument as the path to move files to
  local TYPE=$1; shift
  local GEN_PATH=$1; shift
  local TMP_GEN_PATH=${TMPDIR:-/tmp}/${TYPE}_`date +%s`

  # pass the rest of the arguments to zeus
  (set -x; zeus "$HASURA_GRAPHQL_ENDPOINT"/v1/graphql $TMP_GEN_PATH --ts "$@")

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
    sed -i "" 's,bigint"]:any,bigint"]:number,g' "$TMP_GEN_PATH"/zeus/index.ts
    sed -i "" 's,bigint"]:unknown,bigint"]:number,g' "$TMP_GEN_PATH"/zeus/index.ts
    sed -i "" 's/console\.error(response)/\/\/ eslint-disable-next-line no-console\nconsole\.info(JSON\.stringify(response))/g' "$TMP_GEN_PATH"/zeus/index.ts
  elif [ "$PLATFORM" == "LINUX" ]; then
    sed -i 's,bigint"]:any,bigint"]:number,g' "$TMP_GEN_PATH"/zeus/index.ts
    sed -i 's,bigint"]:unknown,bigint"]:number,g' "$TMP_GEN_PATH"/zeus/index.ts
    sed -i 's/console\.error(response)/\/\/ eslint-disable-next-line no-console\nconsole\.info(JSON\.stringify(response))/g' "$TMP_GEN_PATH"/zeus/index.ts
  else
    echo "unknown platform; exiting"
    exit 1
  fi


  test -d $GEN_PATH && rm -r $GEN_PATH
  mv -f $TMP_GEN_PATH $GEN_PATH
}

generate admin $ADMIN_PATH --node -h x-hasura-admin-secret:$HASURA_GRAPHQL_ADMIN_SECRET
generate user $USER_PATH -h x-hasura-role:user -h "authorization:generate"

# fix formatting of generated files
node_modules/.bin/prettier --write {$ADMIN_PATH,$USER_PATH}
