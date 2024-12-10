using System.Threading.Tasks;

using Azure.Core;
using Azure.Identity;

using Microsoft.AspNetCore.Mvc;

namespace Microsoft.Azure.SignalR.Test.Server;

[Route("aad")]
public class MicrosoftEntraAuthController : Controller
{
    private const string Audience = "https://signalr.azure.com";

    private static readonly string[] DefaultScopes = [$"{Audience}/.default"];

    private static string BuildAuthority(string tenantId)
    {
        return $"https://login.microsoftonline.com/{tenantId}";
    }

    [HttpGet("login")]
    public async Task<IActionResult> Get()
    {
        var credential = new DefaultAzureCredential();
        var request = new TokenRequestContext(DefaultScopes);
        var result = await credential.GetTokenAsync(request);
        return Ok(result);
    }
}
