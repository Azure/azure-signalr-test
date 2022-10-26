#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.10.0" "1.11.0" "1.12.0" "1.13.0" "1.14.0" "1.15.2" "1.16.1" "1.17.1" "1.18.3")

for version in "${SDKVersion[@]}"; do
    docker build -t signalr-management-sdk-test:$version -f ./ManagementE2ETest/Dockerfile --build-arg SDKVersion=$version .
    docker tag signalr-management-sdk-test:$version genevadev.azurecr.io/signalr-management-sdk-test:$version
    docker push genevadev.azurecr.io/signalr-management-sdk-test:$version
done

popd
