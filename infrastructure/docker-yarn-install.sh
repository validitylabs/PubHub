#!/bin/bash

yarn_lock_checksum_file="/tmp/yarn-lock-checksum.txt"
yarn_lock_file="/srv/yarn.lock"

if [ -f "$yarn_lock_checksum_file" ]
then
    if ! md5sum -s -c $yarn_lock_checksum_file
    then
	    yarn --check-files --frozen-lockfile --offline
        md5sum $yarn_lock_file > $yarn_lock_checksum_file
    fi
else
    yarn --check-files --frozen-lockfile --offline
    md5sum $yarn_lock_file > $yarn_lock_checksum_file
fi
