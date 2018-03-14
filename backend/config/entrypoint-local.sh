#!/bin/bash
MAX_ATTEMPT_NUM=10
SLEEP_TIME=3

attempt_num=0
until [ ${attempt_num} -ge ${MAX_ATTEMPT_NUM} ]
do
    pg_isready -d ${POSTGRES_URL} && break
    attempt_num=$((attempt_num + 1))
    sleep ${SLEEP_TIME}
done

if [ $attempt_num -eq ${MAX_ATTEMPT_NUM} ]
then
    exit 3
fi

exec "$@"
