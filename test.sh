#!/bin/bash

DIR=$(cd `dirname $0`; pwd)
VERSION=$1
CONNECTION_STRING=$2

if [ -z "$VERSION" ]
then
    echo SDK version not found!
    exit 1
fi

if [ -z "$CONNECTION_STRING" ]
then
    echo Azure SignalR Service connection string not found!
    exit 1
fi

pushd ${DIR}

docker build -t signalr-test:$VERSION --build-arg SDKVersion=$VERSION .
docker run --rm -e Azure__SignalR__ConnectionString="${CONNECTION_STRING}" -e DELAY=1000 signalr-test:${VERSION}

popd
