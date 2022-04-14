#!/bin/bash
# for use in docker-compose.yml only

# try to create database
psql $DATABASE_URL -c "create database $DB_NAME" 2>/dev/null

# it's not a problem if it already exists
exit 0