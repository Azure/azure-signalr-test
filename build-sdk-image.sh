#!/bin/bash

set -x

DIR=$(cd `dirname $0`; pwd)
pushd ${DIR}

# Build the base docker image
docker build -t signalr-test-base -f ./RuntimeBase.Dockerfile .

declare -a SDKVersion=("1.0.14" "1.2.3" "1.4.3" "1.5.0" "1.5.1" "1.5.2-preview1-10632")
# declare -a SDKVersion=("1.5.2-preview1-10632")

for version in "${SDKVersion[@]}"; do
    if [[ $version > "1.5.1" ]]; then 
        echo $version
    fi
    docker build -t signalr-test:$version --build-arg SDKVersion=$version --build-arg AAD_ENABLED=1 .
    docker tag signalr-test:$version genevadev.azurecr.io/signalr-test:$version
    docker push genevadev.azurecr.io/signalr-test:$version
done

popd