#!/bin/bash
set -e


set -o allexport
source .env
set +o allexport

export GENERATE_HEADER="authorization:generate-$HASURA_ADMIN_SECRET"
export GEN_PATH=./src/lib/gql

# Generate the types for different users.

export MV_PATH=$GEN_PATH/zeusHasuraAdmin
zeus $HASURA_URL $GEN_PATH --ts --rq -h x-hasura-admin-secret:$HASURA_ADMIN_SECRET
test -d $GEN_PATH/zeus
[[ -d "$MV_PATH" ]] && rm -r $MV_PATH
mv $GEN_PATH/zeus $MV_PATH

export MV_PATH=$GEN_PATH/zeusUser
zeus $HASURA_URL $GEN_PATH --ts --rq -h $GENERATE_HEADER -h x-hasura-role:user
test -d $GEN_PATH/zeus
[[ -d "$MV_PATH" ]] && rm -r $MV_PATH
mv $GEN_PATH/zeus $MV_PATH
