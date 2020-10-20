using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Logging.Abstractions;

namespace ManagementE2ETest
{
    public class TestContext
    {
        private readonly int _clientConnectionCount;
        private readonly int _groupCount;
        private readonly string _hubName;

        public IEnumerable<string> ClientAccessTokens { get; set; }

        public string ClientEndpoint { get; set; }

        public string[] GroupNames { get; set; }
        public IServiceHubContext Hub { get; set; }

        public ConcurrentDictionary<int, int> ReceivedMessages { get; } = new ConcurrentDictionary<int, int>();
        public string[] UserNames { get; set; }

        public TestContext(int clientConnectionCount)
        {
            _hubName = "ManagementTestHub";
            _clientConnectionCount = clientConnectionCount;
            _groupCount = 2;
        }

        public IServiceManager BuildServiceManager()
        {
            var managerBuilder = new ServiceManagerBuilder();
            managerBuilder.WithOptions(options =>
            {
                options.ConnectionString = Environment.GetEnvironmentVariable("Azure__SignalR__ConnectionString");
                Console.WriteLine(options.ConnectionString);
            });
            return managerBuilder.Build();
        }

        public Task DisposeAsync()
        {
            return Hub.DisposeAsync();
        }

        public async Task<TestContext> Init()
        {
            var serviceManager = BuildServiceManager();

            UserNames = GenerateRandomNames(_clientConnectionCount);
            GroupNames = GenerateRandomNames(_groupCount);

            Hub = await serviceManager.CreateHubContextAsync(
                _hubName, NullLoggerFactory.Instance);

            ClientEndpoint = serviceManager.GetClientEndpoint(_hubName);
            ClientAccessTokens = from userName in UserNames
                                 select serviceManager.GenerateClientAccessToken(_hubName, userName);
            return this;
        }

        private static string[] GenerateRandomNames(int count)
        {
            var names = new string[count];
            for (var i = 0; i < count; i++)
            {
                names[i] = Guid.NewGuid().ToString();
            }
            return names;
        }
    }
}
