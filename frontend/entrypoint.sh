#!/bin/bash

echo "Pulling from master..."
git fetch --all
git pull --all

eval "git checkout $FRONTEND_BRANCH"
echo "Rebuilding frontend..."
yarn && yarn run build:prod

echo "Starting frontend server in docker mode..."
yarn run start:prod
