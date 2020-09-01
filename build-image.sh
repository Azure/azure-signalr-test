#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.0.0" "1.0.1" "1.0.2" "1.0.3" "1.0.4" "1.0.5" "1.0.14" "1.5.0")

for version in "${SDKVersion[@]}"; do
    docker build -t signalr-test:$version --build-arg SDKVersion=$version .
    docker tag signalr-test:$version genevadev.azurecr.io/signalr-test:$version
done

popd
