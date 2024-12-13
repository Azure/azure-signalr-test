docker run -e Azure__SignalR__ConnectionString="$defaultconnstring" --name signalr-e2e-test genevadev.azurecr.io/signalr-e2e-test && EXIT_STATUS=$?
docker rm signalr-e2e-test
exit $EXIT_STATUS