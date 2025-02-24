set -e

dotnet restore
dotnet user-secrets set Azure:SignalR:ConnectionString "$defaultconnstring"

# Check the result
echo "Run SimpleEcho test with net 9.0"
dotnet run -f net 9.0 | tee "log"
grep "Hello!" log