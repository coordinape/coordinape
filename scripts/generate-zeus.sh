#!/bin/bash
set -e

set -o allexport
source .env
set +o allexport

GEN_PATH=./src/lib/gql

function generate() {
  # use the first argument as the path to move files to
  local MV_PATH=$GEN_PATH/$1; shift

  # pass the rest of the arguments to zeus
  zeus $NODE_HASURA_URL $GEN_PATH --ts --rq $@
  test -d $GEN_PATH/zeus
  test -d "$MV_PATH" && rm -r $MV_PATH
  mv $GEN_PATH/zeus $MV_PATH

  # mac sed needs sed -i '' -e
  # for other seds try removing -i '' -e
  # use `brew install gsed` on macos to get this
  gsed -i 's,bigint"]:any,bigint"]:number,g' $MV_PATH/index.ts
  gsed -i 's,bigint"]:unknown,bigint"]:number,g' $MV_PATH/index.ts
}

generate zeusHasuraAdmin -h x-hasura-admin-secret:$NODE_HASURA_ADMIN_SECRET
generate zeusUser -h x-hasura-role:user -h "authorization:generate-$NODE_HASURA_ADMIN_SECRET"

# fix formatting of generated files
node_modules/.bin/prettier --write $GEN_PATH
