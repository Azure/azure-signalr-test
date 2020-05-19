# ASRS Management Test using ARM

Test Cases:
* [Create SignalR](#create-signalr)

### Create SignalR

* Template deployment
  * Go to Azure Portal
  * Click **Create a resource**
  * Search **template** in marketplace, and select **emplate deployment (deploy using custom templates)**
  * Click **Create**.
  * Click **Build your own template in the editor**, which opens an editor to edit template
  * Copy the content of file *createSignalR/azureDeploy.template.json* to the editor
  * Click **Save**
  * After saved, select or create **Resource Group**. For other parameters, can either use the default vaule or any value you'd like to use.
  * Click "Review + Create".
  * Validate the deployment succeeded
  * After succeeded, click **Microsoft.Template** in the notification, and validate the *signalr-connection-string* is included in the Outputs section  
