set -e
# Generate a unique suffix for the service name
let randomNum=$RANDOM

# Generate a unique service and group name with the suffix
defaultName=signalr-e2e-$asrs_location-$randomNum
serverlessName=signalr-serverless-e2e-$asrs_location-$randomNum

# random delay 1-10 sec
sleep .$((($RANDOM % 10) + 1))s

# Create the Azure SignalR Service resource
az signalr create \
  --name $defaultName \
  --resource-group $asrs_resource_group \
  --sku Standard_S1 --unit-count 2 --service-mode Default \
  --location $asrs_location

az signalr create \
  --name $serverlessName \
  --resource-group $asrs_resource_group \
  --sku Standard_S1 --unit-count 2 --service-mode Default \
  --location $asrs_location

defaultConnectionString=$(az signalr key list --name $defaultName \
  --resource-group $asrs_resource_group --query primaryConnectionString -o tsv)

serverlessConnectionString=$(az signalr key list --name $serverlessName \
  --resource-group $asrs_resource_group --query primaryConnectionString -o tsv)

echo "##vso[task.setvariable variable=defaultname]$defaultName"
echo "##vso[task.setvariable variable=serverlessname]$serverlessName"
echo "##vso[task.setvariable variable=defaultconnstring]$defaultConnectionString"
echo "##vso[task.setvariable variable=serverlessconnstring]$serverlessConnectionString"

sleep 600s
