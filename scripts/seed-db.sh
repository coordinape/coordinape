set -e

set -o allexport
source .env
set +o allexport

echo "Using .env.LOCAL_WEB_SERVER=$LOCAL_WEB_SERVER"

echo "\nClearing current db rows"
curl -s "$LOCAL_WEB_SERVER/api/admin/rmrf" > /dev/null
echo "\nSeeding with test data"
curl "$LOCAL_WEB_SERVER/api/admin/seed"
echo "\n\nAdding .env.LOCAL_WALLET_ADDRESS=$LOCAL_WALLET_ADDRESS to circles"
curl "$LOCAL_WEB_SERVER/api/admin/add-me?address=$LOCAL_WALLET_ADDRESS"