using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using Xunit;

namespace ManagementE2ETest
{
    public class RestActionApisTests : TestBase
    {
        static Task Empty(IServiceHubContext context, IDictionary<string, List<string>> dict) =>
            Task.CompletedTask;

        [Theory]
        [InlineData(ServiceTransportType.Persistent, 1)]
        [InlineData(ServiceTransportType.Persistent, 2)]
        [InlineData(ServiceTransportType.Persistent, 4)]
        public async Task ConnectionAddRemoveGroupTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                var groupName = context.GroupNames[0];
                var group = context.Hub.Clients.Group(context.GroupNames[0]);

                await RunTestCore(context,
                    async (connections) =>
                    {
                        foreach (var connection in connections)
                        {
                            await context.Hub.Groups.AddToGroupAsync(connection.ConnectionId, groupName);
                        }

                        await group.SendAsync(TestConstants.MethodName, TestConstants.Message);

                        await Task.Delay(OneSec);

                        foreach (var connection in connections)
                        {
                            await context.Hub.Groups.RemoveFromGroupAsync(connection.ConnectionId, groupName);
                        }
                        await group.SendAsync(TestConstants.MethodName, TestConstants.Message);
                    },
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
        [InlineData(ServiceTransportType.Persistent, 4)]
        public async Task RemoveUserFromAllGroupsTest(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var receivedMessageDict = new ConcurrentDictionary<int, int>();
            var context = await new TestContext(clientConnectionCount).Init();

            try
            {
                var userNames = context.UserNames;
                var groupNames = context.GroupNames;
                var groups = context.Hub.Clients.Groups(groupNames);

                Task sendTaskFunc() => groups.SendAsync(TestConstants.MethodName, TestConstants.Message);
                var userGroupDict = new Dictionary<string, List<string>> { { userNames[0], groupNames.ToList() } };

                await RunTestCore(
                    context,
                    _ => SendToGroupCore(context.Hub,
                        userGroupDict,
                        sendTaskFunc,
                        AddUserToGroupAsync,
                        UserRemoveFromAllGroupsAsync),
                    groupNames.Length);
            }
            finally
            {
                await context.Hub.DisposeAsync();
            }
        }

        [Theory]
        [MemberData(nameof(TestData))]
        public async Task TestAddUserToGroupWithTtl(ServiceTransportType serviceTransportType, int clientConnectionCount)
        {
            var context = await new TestContext(clientConnectionCount).Init();
            var userNames = context.UserNames;
            var groupNames = context.GroupNames;

            var groupName = groupNames[0];
            var group = context.Hub.Clients.Group(groupName);
            Task SendAsync() => group.SendAsync(TestConstants.MethodName, TestConstants.Message);

            try
            {
                var userGroupDict = GenerateUserGroupDict(userNames, groupNames);
                var receivedMessageDict = new ConcurrentDictionary<int, int>();

                await RunTestCore(
                    context,
                    _ => SendToGroupCore(
                        context.Hub,
                        userGroupDict,
                        SendAsync,
                        (c, d) => AddUserToGroupWithTtlAsync(c, d, TimeSpan.FromSeconds(10)),
                        Empty),
                    (userNames.Length / groupNames.Length + userNames.Length % groupNames.Length) * 2);

                await Task.Delay(TimeSpan.FromSeconds(30));
                context.ReceivedMessages.Clear();

                await RunTestCore(
                    context,
                    _ => SendToGroupCore(context.Hub, userGroupDict, SendAsync, Empty, Empty),
                    0);
            }
            finally
            {
                await context.Hub.DisposeAsync();
            }
        }
    }
}
