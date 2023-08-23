#!/bin/bash
id="$1"
url="https://app.coordinape.com/api/cosoul/screenshot/$id"
echo "Processing ID: $id at $url"
curl -s "$url" >> output.txt
echo "" >> output.txt
