i#!/bin/bash

# Function to delete resource groups starting with signalr-nightly-e2e
cleanup_signalr_nightly_e2e() {
  local PREFIX="signalr-nightly-e2e"

  # Get the list of resource groups that start with the specified prefix
  resource_groups=$(az group list --query "[?starts_with(name, '$PREFIX')].name" -o tsv)

  if [[ -z "$resource_groups" ]]; then
    echo "No resource groups found with prefix '$PREFIX'."
    return 0
  fi

  # Loop through each resource group and delete it
  for rg in $resource_groups; do
    echo "Deleting resource group: $rg"
    az group delete --name "$rg" --yes --no-wait
  done

  echo "Cleanup initiated for resource groups starting with '$PREFIX'."
}

# Call the cleanup function
cleanup_signalr_nightly_e2e