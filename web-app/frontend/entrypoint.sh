#!/bin/bash

echo "Pulling from master..."
git pull origin master

echo "Rebuilding frontend..."
yarn && yarn build

echo "Starting frontend server in docker mode..."
yarn start:docker
