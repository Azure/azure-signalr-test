using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace ManagementE2ETest
{
    public class RestReadApisTests : TestBase
    {
        [Fact]
        public async Task CheckUserExistenceTest()
        {
            // TODO
        }

        [Fact]
        public async Task CheckGroupExistenceTest()
        {
            // TODO
        }

        [Fact]
        public async Task CheckConnectionExistenceTest()
        {
            // TODO
        }

        [Fact]
        public async Task CheckUserExistenceInGroupTest()
        {
            var hubName = nameof(CheckUserExistenceInGroupTest);
            var groupName = $"{nameof(CheckUserExistenceInGroupTest)}_group";
            var userName = $"{nameof(CheckUserExistenceInGroupTest)}_user";

            var serviceManager = BuildServiceManager();
            var clientToken = serviceManager.GenerateClientAccessToken(hubName, userName);
            var endpoint = serviceManager.GetClientEndpoint(hubName);

            var connection = CreateHubConnection(endpoint, clientToken);

            var ctoken = new CancellationTokenSource(TimeSpan.FromSeconds(15)).Token;

            var hubContext = await serviceManager.CreateHubContextAsync(hubName, NullLoggerFactory.Instance, ctoken);

            await connection.StartAsync(ctoken);
            await Task.Delay(OneSec);

            await hubContext.UserGroups.AddToGroupAsync(userName, groupName, ctoken);
            await Task.Delay(OneSec);
            Assert.True(await hubContext.UserGroups.IsUserInGroup(userName, groupName, ctoken));

            await hubContext.UserGroups.RemoveFromGroupAsync(userName, groupName, ctoken);
            await Task.Delay(OneSec);
            Assert.False(await hubContext.UserGroups.IsUserInGroup(userName, groupName, ctoken));

            await connection.StopAsync(ctoken);
        }

    }
}
