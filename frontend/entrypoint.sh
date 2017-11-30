#!/bin/bash

echo "Pulling from master..."
git pull origin master

echo "Rebuilding frontend..."
yarn && yarn run build:prod

echo "Starting frontend server in docker mode..."
yarn run start:prod
