delete_all_resources_in_group() {
    local resource_group=$1

    if [ -z "$resource_group" ]; then
        echo "Error: Resource group name is required."
        return 1
    fi

    # Get list of resource IDs in the specified resource group
    resource_ids=$(az resource list --resource-group "$resource_group" --query "[].id" -o tsv)

    if [ -z "$resource_ids" ]; then
        echo "No resources found in resource group '$resource_group'."
        return 0
    fi

    # Loop through each resource ID and delete it one by one
    for resource_id in $resource_ids; do
        echo "Deleting resource: $resource_id"
        az resource delete --ids "$resource_id"

        if [ $? -eq 0 ]; then
            echo "Successfully deleted resource: $resource_id"
        else
            echo "Failed to delete resource: $resource_id"
        fi
    done

    echo "Resource deletion process completed for '$resource_group'."

    # Delete the resource group after deleting all resources
    echo "Deleting resource group: $resource_group"
    az group delete --name "$resource_group" --yes --no-wait

    if [ $? -eq 0 ]; then
        echo "Resource group '$resource_group' deletion initiated."
    else
        echo "Failed to delete resource group '$resource_group'."
    fi
}

delete_all_resources_in_group $current_resource_group