#!/bin/bash
set -e

SERVICE_AAD=1 dotnet server/Server.dll > /dev/null &

# Wait for server to have started
echo "Wait server for 10s"
sleep 10

npm test --prefix SDKTest