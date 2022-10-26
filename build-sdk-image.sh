#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.10.0" "1.11.0" "1.12.0" "1.13.0" "1.14.0" "1.15.2" "1.16.1" "1.17.1" "1.18.3")

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