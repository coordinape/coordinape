#!/bin/bash


if [ -z "${PROD_POSTGRES_URL}" ]; then
    echo "PROD_POSTGRES_URL env var must be set in .env"
    exit 1
fi

LIMIT=2000

# this gets us the famous 200 users who are like tier 0.5 ? 1?
SCRIPT_DIR=$(dirname "$(realpath "$0")")
# declare a bash function that takes sql as first arg and runs it
function sql() {
  command="psql ${PROD_POSTGRES_URL} -c \"$1\""
  echo "Executing: $command"
  eval "$command"
  echo "Done"
}

function grabRepScore() {
  TABLE=
  WHERE=$2
  sql "\copy (SELECT total_score,p.address,p.name FROM reputation_scores rs JOIN profiles p on p.id=rs.profile_id WHERE total_score>1 ORDER BY total_score desc) TO 'rep-scores.csv' WITH CSV HEADER"
}

grabRepScore