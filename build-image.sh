#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

declare -a SDKVersion=("1.0.0-preview1-10009" "1.0.0-preview1-10011" "1.0.0-preview1-10015")

for version in "${SDKVersion[@]}"; do
    docker build -t signalr-test:$version --build-arg SDKVersion=$version .
done

popd