#!/usr/bin/env bash

# In the remote environments, we need to start up nginx before running yarn.
# We need to do this in two steps because docker filesystem is weird.
sed -e "s/CHANGEME/${ROOT_DOMAIN}/g" </etc/nginx/conf.d/nginx.conf >/tmp/nginx.conf
cp /tmp/nginx.conf /etc/nginx/conf.d/nginx.conf
service nginx start
eval "$@"
