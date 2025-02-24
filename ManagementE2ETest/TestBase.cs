using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Azure.SignalR.Management;
using Xunit;

namespace ManagementE2ETest
{
    public class TestBase
    {
        protected static readonly TimeSpan OneSec = TimeSpan.FromSeconds(1);

        private static readonly ServiceTransportType[] _serviceTransportType = new ServiceTransportType[] {
            // ServiceTransportType.Transient,
            ServiceTransportType.Persistent
        };

        public static IEnumerable<object[]> TestData => from serviceTransportType in _serviceTransportType
                                                        from count in Enumerable.Range(1, 4)
                                                        select new object[] { serviceTransportType, count };
        protected static Task AddUserToGroupAsync(IServiceHubContext hubContext, IDictionary<string, List<string>> userGroupDict)
        {
            return Task.WhenAll(from usergroup in userGroupDict
                                select Task.WhenAll(from grp in usergroup.Value
                                                    select hubContext.UserGroups.AddToGroupAsync(usergroup.Key, grp)));
        }

        protected static Task AddUserToGroupWithTtlAsync(IServiceHubContext hubContext, IDictionary<string, List<string>> userGroupDict, TimeSpan ttl)
        {
            return Task.WhenAll(from usergroup in userGroupDict
                                select Task.WhenAll(from grp in usergroup.Value
                                                    select hubContext.UserGroups.AddToGroupAsync(usergroup.Key, grp, ttl)));
        }

        protected static IServiceManager BuildServiceManager()
        {
            var managerBuilder = new ServiceManagerBuilder();
            managerBuilder.WithOptions(options =>
            {
                options.ConnectionString = Environment.GetEnvironmentVariable("Azure__SignalR__ConnectionString");
                Console.WriteLine(options.ConnectionString);
            });
            return managerBuilder.Build();
        }

        protected static HubConnection CreateHubConnection(string endpoint, string accessToken)
        {
            return new HubConnectionBuilder()
                .WithUrl(endpoint, option =>
                {
                    option.AccessTokenProvider = () =>
                    {
                        return Task.FromResult(accessToken);
                    };
                }).Build();
        }

        protected static IDictionary<string, List<string>> GenerateUserGroupDict(IList<string> userNames, IList<string> groupNames)
        {
            return (from i in Enumerable.Range(0, userNames.Count)
                    select (User: userNames[i], Group: groupNames[i % groupNames.Count]))
                    .ToDictionary(t => t.User, t => new List<string> { t.Group });
        }

        protected static string[] GetTestStringList(string prefix, int count)
        {
            return (from i in Enumerable.Range(0, count)
                    select $"{prefix}{i}").ToArray();
        }

        protected static async Task RunTestCore(
            TestContext context,
            Func<IList<HubConnection>, Task> coreTask,
            int expectedReceivedMessageCount)
        {
            IList<HubConnection> connections = null;
            CancellationTokenSource cancellationTokenSource = null;
            try
            {
                connections = await CreateAndStartClientConnections(
                    context.ClientEndpoint,
                    context.ClientAccessTokens
                );

                cancellationTokenSource = new CancellationTokenSource();
                HandleHubConnection(connections, cancellationTokenSource);
                ListenOnMessage(connections, context.ReceivedMessages);

                Assert.False(cancellationTokenSource.Token.IsCancellationRequested);

                await coreTask(connections);
                await Task.Delay(OneSec);

                Assert.False(cancellationTokenSource.Token.IsCancellationRequested);

                var receivedMessageCount = (from pair in context.ReceivedMessages
                                            select pair.Value).Sum();
                Assert.Equal(expectedReceivedMessageCount, receivedMessageCount);
            }
            finally
            {
                cancellationTokenSource?.Dispose();
                if (connections != null)
                {
                    await Task.WhenAll(from connection in connections
                                       select connection.StopAsync());
                }
            }
        }

        protected static async Task SendToGroupCore(
            IServiceHubContext context,
            IDictionary<string, List<string>> userGroupDict,
            Func<Task> sendTask,
            Func<IServiceHubContext, IDictionary<string, List<string>>, Task> userAddToGroupTask,
            Func<IServiceHubContext, IDictionary<string, List<string>>, Task> userRemoveFromGroupTask)
        {
            await userAddToGroupTask(context, userGroupDict);
            await Task.Delay(OneSec);
            await sendTask();
            await Task.Delay(OneSec);
            await userRemoveFromGroupTask(context, userGroupDict);
            await Task.Delay(OneSec);
            await sendTask();
            await Task.Delay(OneSec);
        }

        protected static Task UserRemoveFromAllGroupsAsync(IServiceHubContext context, IDictionary<string, List<string>> userGroupDict)
        {
            return Task.WhenAll(from user in userGroupDict.Keys
                                select context.UserGroups.RemoveFromAllGroupsAsync(user));
        }

        protected static Task UserRemoveFromGroupsOneByOneAsync(IServiceHubContext context, IDictionary<string, List<string>> userGroupDict)
        {
            return Task.WhenAll(from usergroup in userGroupDict
                                select Task.WhenAll(from grp in usergroup.Value
                                                    select context.UserGroups.RemoveFromGroupAsync(usergroup.Key, grp)));
        }

        private static async Task<IList<HubConnection>> CreateAndStartClientConnections(string clientEndpoint, IEnumerable<string> clientAccessTokens)
        {
            var connections = (from clientAccessToken in clientAccessTokens
                               select CreateHubConnection(clientEndpoint, clientAccessToken)).ToList();

            await Task.WhenAll(from connection in connections
                               select connection.StartAsync());

            return connections;
        }

        private static void HandleHubConnection(IList<HubConnection> connections, CancellationTokenSource cancellationTokenSource)
        {
            foreach (var connection in connections)
            {
                connection.Closed += ex =>
                {
                    cancellationTokenSource.Cancel();
                    return Task.CompletedTask;
                };
            }
        }

        private static void ListenOnMessage(IList<HubConnection> connections, ConcurrentDictionary<int, int> receivedMessageDict)
        {
            for (var i = 0; i < connections.Count(); i++)
            {
                var ind = i;
                connections[i].On(TestConstants.MethodName, (string message) =>
                {
                    if (TestConstants.Message.Equals(message))
                    {
                        receivedMessageDict.AddOrUpdate(ind, 1, (k, v) => v + 1);
                    }
                });
            }
        }
    }
}
