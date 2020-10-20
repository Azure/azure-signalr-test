# Azure SignalR Test
The project to provide automation E2E test on SignalR sdk and service runtime.

## How to build and run
First check the SDK version needed. Each SDKVerison will build a separate docker image and the tag is the sdk version.
```bash
declare -a SDKVersion=("1.5.0" "1.5.1")
```

### Run tests for Server SDK

```bash
./build-sdk-image.sh
```

Then you can run the test with Azure SignalR Service

```bash
docker run -e Azure__SignalR__ConnectionString="<your connection string>" signalr-test:<sdk version>
```


#### Run tests with app server AAD Auth

This test case is for a specific scenario, in which our customer used AAD Auth to authenticate their incoming requests.

Our SDK will simply pass most of the claims in the given JWT Token (for accessing their app server) to the newly generated JWT Token (for connecting to our service).

However, there are still some internal claims that will not be passed.

This test is to check if any of these unpassed claims will cause problems while connecting to ASRS. 

```bash
docker run -e Azure__SignalR__ConnectionString="<your connection string>" -e signalr-test:<sdk version> -e clientId="<clientId>" -e clientSecret="<clientSecret>" -e tenantId="<tenantId>" run-server-aad.sh
```

> The `clientId`, `clientSecret`, `tenantId` here could be any valid [AAD Application](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps).

### Run tests for Management SDK

```bash
./build-management-image.sh
```

Then you can run the test with Azure SignalR Service

```bash
docker run -e Azure__SignalR__ConnectionString="<your connection string>" signalr-management-sdk-test:<sdk version>
```

## How to upload images to private container registry

```bash
az login // use microsoft account
az acr login -n genevadev
```

Then `docker push <image>`

## Test Coverage
* Connect / Echo / Broadcast / AllExcept
* Group join / leave
* Send Group / Groups / Group Except / OthersInGroup
* Send User / Users
* JWT Auth
* Generic hub / 128 character length hub name support

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
