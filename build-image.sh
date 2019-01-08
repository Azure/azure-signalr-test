#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.0.0-preview1-10009" "1.0.0-preview1-10011" "1.0.0-preview1-10015" "1.0.0-preview1-10200" "1.0.0" "1.0.1")

for version in "${SDKVersion[@]}"; do
    docker build -t signalr-test:$version --build-arg SDKVersion=$version .
done

popd