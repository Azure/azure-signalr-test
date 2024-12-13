set -e

dotnet restore
dotnet user-secrets set Azure:SignalR:ConnectionString "$defaultconnstring"

# Check the result
echo "test net 7.0"
dotnet run -f  net7.0 | tee "log"
grep "Hello!" log