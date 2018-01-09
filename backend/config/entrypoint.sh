#!/bin/bash

python runners/initialize_postgres.py
exec "$@"
