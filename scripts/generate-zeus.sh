set -e

export ENDPOINT=http://localhost:8080/v1/graphql
export SECRET=admin-secret
export GENERATE_HEADER="authorization:generate-$SECRET"
export GEN_PATH=./src/lib/gql

# Generate the types for different users.

export MV_PATH=$GEN_PATH/zeusRoot
zeus $ENDPOINT $GEN_PATH --ts --rq -h x-hasura-admin-secret:$SECRET
test -d $GEN_PATH/zeus
[[ -d "$MV_PATH" ]] && rm -r $MV_PATH
mv $GEN_PATH/zeus $MV_PATH

export MV_PATH=$GEN_PATH/zeusUser
zeus $ENDPOINT $GEN_PATH --ts --rq -h $GENERATE_HEADER -h x-hasura-role:user
test -d $GEN_PATH/zeus
[[ -d "$MV_PATH" ]] && rm -r $MV_PATH
mv $GEN_PATH/zeus $MV_PATH
