#!/bin/bash
set -e

set -o allexport
source .env
set +o allexport

GENERATE_HEADER="authorization:generate-$NODE_HASURA_ADMIN_SECRET"
GEN_PATH=./src/lib/gql

# Generate the types for different users.

MV_PATH=$GEN_PATH/zeusHasuraAdmin
zeus $NODE_HASURA_URL $GEN_PATH --ts --rq -h x-hasura-admin-secret:$NODE_HASURA_ADMIN_SECRET
test -d $GEN_PATH/zeus
[[ -d "$MV_PATH" ]] && rm -r $MV_PATH
mv $GEN_PATH/zeus $MV_PATH

# mac sed needs sed -i '' -e
# for other seds try removing -i '' -e
gsed -i 's,bigint"]:any,bigint"]:number,g' $MV_PATH/index.ts
gsed -i 's,bigint"]:unknown,bigint"]:number,g' $MV_PATH/index.ts
gsed -i 's,"'"$NODE_HASURA_URL"'",process.env.REACT_APP_HASURA_URL as string,g' $MV_PATH/reactQuery.ts

MV_PATH=$GEN_PATH/zeusUser
zeus $NODE_HASURA_URL $GEN_PATH --ts --rq -h $GENERATE_HEADER -h x-hasura-role:user
test -d $GEN_PATH/zeus
[[ -d "$MV_PATH" ]] && rm -r $MV_PATH
mv $GEN_PATH/zeus $MV_PATH

gsed -i 's,bigint"]:any,bigint"]:number,g' $MV_PATH/index.ts
gsed -i 's,bigint"]:unknown,bigint"]:number,g' $MV_PATH/index.ts
gsed -i 's,"'"$NODE_HASURA_URL"'",process.env.REACT_APP_HASURA_URL as string,g' $MV_PATH/reactQuery.ts
