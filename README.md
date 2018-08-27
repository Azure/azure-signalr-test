# Azure SignalR Test
The project to provide automation E2E test on SignalR sdk and service runtime.

## How to build and run
First check the SDK version needed. Each SDKVerison will build a separate docker image and the tag is the sdk version.
```bash
# build-image.sh
declare -a SDKVersion=("1.0.0-preview1-10009" "1.0.0-preview1-10011")
```
```bash
./build-image.sh
```

Then you can run the test with Azure SignalR Service
```bash
docker run -e Azure__SignalR__ConnectionString="<your connection string>"  signalr-test:<sdk version>
```

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
