#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.8.2" "1.9.0")

for version in "${SDKVersion[@]}"; do
    echo $version
    if [[ $version > "1.5.1" ]]; then 
        docker build -t signalr-test:$version --build-arg SDKVersion=$version --build-arg AAD_ENABLED=1 .
    else
        docker build -t signalr-test:$version --build-arg SDKVersion=$version .
    fi
    docker tag signalr-test:$version genevadev.azurecr.io/signalr-test:$version
    docker push genevadev.azurecr.io/signalr-test:$version
done

popd