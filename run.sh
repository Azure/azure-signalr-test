#!/bin/bash
set -e
dotnet server/Server.dll > /dev/null &
dotnet serverAad/ServerAad.dll > /dev/null &

# Wait for server to have started
echo "Wait server for 10s"
sleep 10

npm test --prefix client