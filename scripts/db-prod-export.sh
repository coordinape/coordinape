#!/bin/bash


if [ -z "${PROD_POSTGRES_URL}" ]; then
    echo "PROD_POSTGRES_URL env var must be set in .env"
    exit 1
fi

INITIAL_FIDS="382051,244292,380810"
PROFILE_IDS="2947,3238,3201,3199,4229,670,5988,7588,1346,1933"
LINKS_LIMIT=2000

IGNORE_FIDS="(fid>10 AND fid!=354669)"
# this gets us the famous 200 users who are like tier 0.5 ? 1?
SELECT_FIDS="select fid from farcaster.fids where ${IGNORE_FIDS} AND (fid IN(select target_fid from farcaster.links where fid IN(${INITIAL_FIDS}) LIMIT ${LINKS_LIMIT})) OR (fid IN(select fid from farcaster.links where target_fid IN(${INITIAL_FIDS}) LIMIT ${LINKS_LIMIT}))"
DATE_WITH_TIME=`date "+%F-%H%M%S"`

SCRIPT_DIR=$(dirname "$(realpath "$0")")
SEED_DIR=${SCRIPT_DIR}/../seed/farcaster



# declare a bash function that takes sql as first arg and runs it
function sql() {
  command="psql ${PROD_POSTGRES_URL} -c \"$1\""
  echo "Executing: $command"
  eval "$command"
  echo "Done"
}

# grabFCTableData uses the arg to the function as the table name to grab
function grabFCTableData() {
  TABLE=$1
  sql "\copy (SELECT * FROM farcaster.${TABLE} WHERE fid IN (${SELECT_FIDS})) TO '${SEED_DIR}/${DATE_WITH_TIME}.farcaster.${TABLE}.csv' WITH CSV HEADER"
}

function grabTableData() {
  TABLE=$1
  sql "\copy (SELECT * FROM ${TABLE}) TO '${SEED_DIR}/${DATE_WITH_TIME}.${TABLE}.csv' WITH CSV HEADER"
}

function grabTableDataWhere() {
  TABLE=$1
  WHERE=$2
  sql "\copy (SELECT * FROM ${TABLE} WHERE ${WHERE}) TO '${SEED_DIR}/${DATE_WITH_TIME}.${TABLE}.csv' WITH CSV HEADER"
}

# uncomment these to get more tables

# grabFCTableData "fids"
# grabFCTableData "fnames"
# grabFCTableData "verifications"
# grabFCTableData "user_data"
# grabFCTableData "casts"
# grabFCTableData "links"
# grabTableData "public.link_holders"
# grabTableData "public.colinks_gives"
grabTableDataWhere "public.profiles" "id IN (${PROFILE_IDS})"
