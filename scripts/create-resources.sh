set -e

# Function to check SignalR status
check_signalr_status() {
  local RESOURCE_GROUP="$1"
  local SIGNALR_NAME="$2"
  local TIMEOUT="$3"
  local INTERVAL=1 # Check interval in seconds

  # Validate environment variables
  if [[ -z "$RESOURCE_GROUP" || -z "$SIGNALR_NAME" || -z "$TIMEOUT" ]]; then
    echo "Error: Missing required parameters. RESOURCE_GROUP, SIGNALR_NAME, and TIMEOUT must be set."
    return 1
  fi

  echo "Creating SignalR resource $SIGNALR_NAME..."

  # Start time
  local START_TIME=$(date +%s)

  while true; do
    # Get the provisioning state
    local STATUS=$(az signalr show --name "$SIGNALR_NAME" --resource-group "$RESOURCE_GROUP" --query "provisioningState" --output tsv)
    echo "Current status: $STATUS"

    # Check if the status is 'Succeeded'
    if [[ "$STATUS" == "Succeeded" ]]; then
      echo "SignalR resource $SIGNALR_NAME is ready!\n"
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

# Function to check Web PubSub status
check_webpubsub_status() {
  local RESOURCE_GROUP="$1"
  local WEBPUBSUB_NAME="$2"
  local TIMEOUT="$3"
  local INTERVAL=1 # Check interval in seconds

  # Validate environment variables
  if [[ -z "$RESOURCE_GROUP" || -z "$WEBPUBSUB_NAME" || -z "$TIMEOUT" ]]; then
    echo "Error: Missing required parameters. RESOURCE_GROUP, WEBPUBSUB_NAME, and TIMEOUT must be set."
    return 1
  fi

  echo "Creating Web PubSub resource $WEBPUBSUB_NAME..."

  # Start time
  local START_TIME=$(date +%s)

  while true; do
    # Get the provisioning state
    local STATUS=$(az webpubsub show --name "$WEBPUBSUB_NAME" --resource-group "$RESOURCE_GROUP" --query "provisioningState" --output tsv)
    echo "Current status: $STATUS"

    # Check if the status is 'Succeeded'
    if [[ "$STATUS" == "Succeeded" ]]; then
      echo "Web PubSub resource $WEBPUBSUB_NAME is ready!\n"
      return 0
    fi

    # Check timeout
    local CURRENT_TIME=$(date +%s)
    local ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
    if [[ $ELAPSED_TIME -ge $TIMEOUT ]]; then
      echo "Timeout reached! Web PubSub resource did not reach 'Succeeded' state within $TIMEOUT seconds."
      return 1
    fi

    # Wait for the next check
    sleep $INTERVAL
  done
}

if [[ -z "$location" ]]; then
  echo "Error: Missing required parameters. resource_group and location must be set."
  exit 1
fi

random_num=$(shuf -i 10000-99999 -n 1)
current_resource_group="signalr-nightly-e2e-${location}-${random_num}"
echo $current_resource_group

echo "asrs location: $location"
echo "asrs resource group: $current_resource_group"
echo "app client id: $app_client_id"

# Generate a unique service and group name with the suffix
signalr_default_name=signalr-e2e-$location-$random_num
signalr_serverless_name=signalr-serverless-e2e-$location-$random_num
webpubsub_default_name=webpubsub-e2e-$location-$random_num

# random delay 1-10 sec
sleep .$((($RANDOM % 10) + 1))s

az upgrade --yes

if [[ "$location" == "switzerlandwest" ]]; then
  echo "We are not able to create Resource Group in Switzerland West, so we will create in West Europe";
  az group create --name $current_resource_group --location westeurope
else
  az group create --name $current_resource_group --location $location
fi

subscription_id=$(az account show --query id -o tsv)
scope="/subscriptions/$subscription_id/resourceGroups/$current_resource_group"
echo "scope: $scope"

az role assignment create --assignee $app_client_id --role "SignalR App Server" --scope $scope
az role assignment create --assignee $app_client_id --role "SignalR Service Owner" --scope $scope
az role assignment create --assignee $app_client_id --role "Web PubSub Service Owner" --scope $scope

az keyvault secret download --vault-name signalrcloudtestkv --name azure-signalr-service-nightly-test --encoding base64 --file cert.pfx
echo "cert.pfx downloaded"

# Create the Azure SignalR Service resource
time az signalr create \
  --name $signalr_default_name \
  --resource-group $current_resource_group \
  --sku Standard_S1 --unit-count 2 --service-mode Default \
  --location $location > /dev/null
echo ""

time az signalr create \
  --name $signalr_serverless_name \
  --resource-group $current_resource_group \
  --sku Standard_S1 --unit-count 2 --service-mode Serverless \
  --location $location > /dev/null
echo ""

time az webpubsub create \
  --name $webpubsub_default_name \
  --resource-group $current_resource_group \
  --sku Standard_S1 --unit-count 2 \
  --location $location > /dev/null
echo ""

check_signalr_status $current_resource_group $signalr_default_name 600
check_signalr_status $current_resource_group $signalr_serverless_name 600
check_webpubsub_status $current_resource_group $webpubsub_default_name 600

signalr_default_connstr=$(az signalr key list --name $signalr_default_name \
  --resource-group $current_resource_group --query primaryConnectionString -o tsv)

signalr_serverless_connstr=$(az signalr key list --name $signalr_serverless_name \
  --resource-group $current_resource_group --query primaryConnectionString -o tsv)

webpubsub_connstr=$(az webpubsub key show --name $webpubsub_default_name \
  --resource-group $current_resource_group --query primaryConnectionString -o tsv)

echo "##vso[task.setvariable variable=signalr_default_connstr]$signalr_default_connstr"
echo "##vso[task.setvariable variable=signalr_serverless_connstr]$signalr_serverless_connstr"

echo "##vso[task.setvariable variable=webpubsub_connstr]$webpubsub_connstr"

echo "##vso[task.setvariable variable=current_resource_group]$current_resource_group"

# secondary regions
# australiasoutheast,canadaeast,centralus,germanywestcentral,italynorth,japanwest,jioindiawest,polandcentral,qatarcentral,southeastasia,southcentralus,switzerlandwest,uksouth,westeurope,westus,westus3

# primary regions
# australiaeast,brazilsouth,canadacentral,centralindia,eastasia,eastus2,francecentral,japaneast,koreacentral,northcentralus,northeurope,norwayeast,southafricanorth,swedencentral,switzerlandnorth,uaenorth,ukwest
