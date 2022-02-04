#!/bin/bash
# This makes sure the coordinape bucket exists. It is run by the localstack docker container
set -x
awslocal s3 mb s3://coordinape
set +x
