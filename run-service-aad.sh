#!/bin/bash
set -e
dotnet server/Server.dll > /dev/null &

# Wait for server to have started
echo "Wait server for 10s"
sleep 10

npm run test-service-aad --prefix SDKTest