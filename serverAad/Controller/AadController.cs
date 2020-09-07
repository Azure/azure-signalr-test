using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace Microsoft.Azure.SignalR.Test.Server
{
    [Route("aad")]
    public class AadController : ControllerBase
    {
        private const string Audience = "https://signalr.azure.com";

        private static readonly string[] DefaultScopes = new string[] { $"{Audience}/.default" };

        private static string BuildAuthority(string tenantId)
        {
            return $"https://login.microsoftonline.com/{tenantId}";
        }

        [HttpGet("login")]
        public async Task<IActionResult> Get()
        {
            var clientId = Environment.GetEnvironmentVariable("clientId") ?? throw new ArgumentNullException();
            var clientSecret = Environment.GetEnvironmentVariable("clientSecret") ?? throw new ArgumentNullException();
            var tenantId = Environment.GetEnvironmentVariable("tenantId") ?? throw new ArgumentNullException();

            var app = ConfidentialClientApplicationBuilder
                .Create(clientId)
                .WithClientSecret(clientSecret)
                .WithAuthority(BuildAuthority(tenantId))
                .Build();

            var result = await app.AcquireTokenForClient(DefaultScopes).ExecuteAsync();

            return Ok(result.AccessToken);
        }
    }
}
