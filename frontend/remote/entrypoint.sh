#!/usr/bin/env bash

# In the remote environments, we need to start up nginx before running yarn.
service nginx start
eval "$@"
