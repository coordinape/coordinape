#!/bin/bash

# read .env, filtering out comments
export $(cat ../.env | sed 's/^#.*$//' | xargs)

exec yarn hardhat node