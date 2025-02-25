set -e
# Generate a unique suffix for the service name
let randomNum=$RANDOM

# Function to check SignalR status
check_signalr_status() {
    local RESOURCE_GROUP="$1"
    local SIGNALR_NAME="$2"
    local TIMEOUT="$3"
    local INTERVAL=1  # Check interval in seconds

    # Validate environment variables
    if [[ -z "$RESOURCE_GROUP" || -z "$SIGNALR_NAME" || -z "$TIMEOUT" ]]; then
        echo "Error: Missing required parameters. RESOURCE_GROUP, SIGNALR_NAME, and TIMEOUT must be set."
        return 1
    fi

    # Start time
    local START_TIME=$(date +%s)

    while true; do
        # Get the provisioning state
        local STATUS=$(az signalr show --name "$SIGNALR_NAME" --resource-group "$RESOURCE_GROUP" --query "provisioningState" --output tsv)
        echo "Current status: $STATUS"

        # Check if the status is 'Succeeded'
        if [[ "$STATUS" == "Succeeded" ]]; then
            echo "SignalR resource is ready!"
            return 0
        fi

        # Check timeout
        local CURRENT_TIME=$(date +%s)
        local ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
        if [[ $ELAPSED_TIME -ge $TIMEOUT ]]; then
            echo "Timeout reached! SignalR resource did not reach 'Succeeded' state within $TIMEOUT seconds."
            return 1
        fi

        # Wait for the next check
        sleep $INTERVAL
    done
}

if [[ -z "$resourceGroup" || -z "$location" ]]; then
  echo "Error: Missing required parameters. resourceGroup and location must be set."
  exit 1
fi

echo "asrs location: $location"
echo "asrs resource group: $resourceGroup"

# Generate a unique service and group name with the suffix
signalrDefaultName=signalr-e2e-$location-$randomNum
signalrServerlessName=signalr-serverless-e2e-$location-$randomNum

# random delay 1-10 sec
sleep .$((($RANDOM % 10) + 1))s

# Create the Azure SignalR Service resource
az signalr create \
  --name $signalrDefaultName \
  --resource-group $resourceGroup \
  --sku Standard_S1 --unit-count 2 --service-mode Default \
  --location $location

az signalr create \
  --name $signalrServerlessName \
  --resource-group $resourceGroup \
  --sku Standard_S1 --unit-count 2 --service-mode Serverless \
  --location $location

check_signalr_status $resourceGroup $signalrDefaultName 600
check_signalr_status $resourceGroup $signalrServerlessName 600

signalrDefaultConnStr=$(az signalr key list --name $signalrDefaultName \
  --resource-group $resourceGroup --query primaryConnectionString -o tsv)

signalrServerlessConnStr=$(az signalr key list --name $signalrServerlessName \
  --resource-group $resourceGroup --query primaryConnectionString -o tsv)

echo "##vso[task.setvariable variable=signalrDefaultName]$signalrDefaultName"
echo "##vso[task.setvariable variable=signalrDefaultConnStr]$signalrDefaultConnStr"

echo "##vso[task.setvariable variable=signalrServerlessName]$signalrServerlessName"
echo "##vso[task.setvariable variable=signalrServerlessConnStr]$signalrServerlessConnStr"