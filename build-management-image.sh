#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.5.0")

for version in "${SDKVersion[@]}"; do
    docker build -t signalr-management-test:$version -f ./ManagementE2ETest/Dockerfile --build-arg SDKVersion=$version .
    docker tag signalr-management-test:$version genevadev.azurecr.io/signalr-management-test:$version
    docker push genevadev.azurecr.io/signalr-management-test:$version
done

popd
