param (
    [Parameter(Mandatory=$true)][string]$version,
    [Parameter(Mandatory=$true)][string]$connectionString,
    [bool]$quiet = $true
)

if ($quiet) {
    $dockerBuildArgs = "-q"
}

docker build $dockerBuildArgs -t signalr-test:$version --build-arg SDKVersion=$version .
docker run --rm -e Azure__SignalR__ConnectionString="$connectionString" -e DELAY=1000 signalr-test:$version
