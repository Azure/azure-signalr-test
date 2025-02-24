set -e

dotnet restore
dotnet user-secrets set Azure:SignalR:ConnectionString "$defaultconnstring"

# Check the result
echo "test net 8.0"
dotnet run -f  net 8.0 | tee "log"
grep "Hello!" log