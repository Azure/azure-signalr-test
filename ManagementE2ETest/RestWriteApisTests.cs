using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using Xunit;

namespace ManagementE2ETest
{
    public class RestWriteApisTests : TestBase
    {
        [Theory]
        [MemberData(nameof(TestData))]
        public async Task BroadcastTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();
            try
            {
                var all = context.Hub.Clients.All;
                Task sendTaskFunc() => all.SendAsync(TestConstants.MethodName, TestConstants.Message);

                await RunTestCore(
                    context,
                    _ => sendTaskFunc(),
                    clientConnectionCount);
            }
            finally
            {
                await context.DisposeAsync();
            }
        }

        [Theory]
        [InlineData(ServiceTransportType.Persistent, 1)]
        [InlineData(ServiceTransportType.Persistent, 2)]
        [InlineData(ServiceTransportType.Persistent, 5)]
        public async Task SendToGroupsTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                var userNames = context.UserNames;
                var groupNames = context.GroupNames;
                var groups = context.Hub.Clients.Groups(groupNames);

                Task sendTaskFunc() => groups.SendAsync(TestConstants.MethodName, TestConstants.Message);
                var userGroupDict = GenerateUserGroupDict(userNames, groupNames);

                await RunTestCore(
                    context,
                    _ => SendToGroupCore(
                        context.Hub,
                        userGroupDict,
                        sendTaskFunc,
                        AddUserToGroupAsync,
                        UserRemoveFromGroupsOneByOneAsync),
                    clientConnectionCount);
            }

            finally
            {
                await context.Hub.DisposeAsync();
            }
        }

        [Theory]
        [InlineData(ServiceTransportType.Persistent, 1)]
        [InlineData(ServiceTransportType.Persistent, 2)]
        [InlineData(ServiceTransportType.Persistent, 5)]
        public async Task SendToGroupTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                var userNames = context.UserNames;
                var groupNames = context.GroupNames;
                var group = context.Hub.Clients.Group(groupNames[0]);

                Task sendTaskFunc() => group.SendAsync(TestConstants.MethodName, TestConstants.Message);
                var userGroupDict = GenerateUserGroupDict(userNames, groupNames);

                await RunTestCore(
                    context,
                    _ => SendToGroupCore(
                        context.Hub,
                        userGroupDict,
                        sendTaskFunc,
                        AddUserToGroupAsync,
                        UserRemoveFromGroupsOneByOneAsync),
                    userNames.Length / groupNames.Length + userNames.Length % groupNames.Length);
            }
            finally
            {
                await context.Hub.DisposeAsync();
            }
        }

        [Theory]
        [InlineData(ServiceTransportType.Persistent, 1)]
        [InlineData(ServiceTransportType.Persistent, 2)]
        public async Task SendToUsersTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                var userNames = context.UserNames;
                var users = context.Hub.Clients.Users(userNames);

                Task sendTaskFunc() => users.SendAsync(TestConstants.MethodName, TestConstants.Message);

                await RunTestCore(
                    context,
                    _ => sendTaskFunc(),
                    clientConnectionCount);
            }
            finally
            {
                await context.Hub.DisposeAsync();
            }
        }

        [Theory]
        [InlineData(ServiceTransportType.Persistent, 1)]
        [InlineData(ServiceTransportType.Persistent, 2)]
        public async Task SendToUserTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                var userNames = context.UserNames;
                var user = context.Hub.Clients.User(userNames[0]);
                Task sendTaskFunc() => user.SendAsync(TestConstants.MethodName, TestConstants.Message);

                await RunTestCore(
                    context,
                    _ => sendTaskFunc(),
                    1);
            }
            finally
            {
                await context.Hub.DisposeAsync();
            }
        }

        [Theory]
        [InlineData(ServiceTransportType.Persistent, 1)]
        [InlineData(ServiceTransportType.Persistent, 2)]
        public async Task SendToConnectionTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                await RunTestCore(
                    context,
                    async (connections) =>
                    {
                        foreach (var connection in connections)
                        {
                            var client = context.Hub.Clients.Client(connection.ConnectionId);
                            await client.SendAsync(TestConstants.MethodName, TestConstants.Message);
                        }
                    },
                    clientConnectionCount);
            }
            finally
            {
                await context.Hub.DisposeAsync();
            }
        }
    }
}
