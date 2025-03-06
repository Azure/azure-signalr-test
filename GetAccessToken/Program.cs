using System.IdentityModel.Tokens.Jwt;

using Azure.Core;
using Azure.Identity;

internal class Program
{
    private static async Task Main(string[] args)
    {
        var credential = new DefaultAzureCredential();
        var request = new TokenRequestContext(["https://signalr.azure.com/.default"]);
        var token = await credential.GetTokenAsync(request, CancellationToken.None);

        var handler = new JwtSecurityTokenHandler();

        var jwt = handler.ReadJwtToken(token.Token);

        Console.WriteLine("Header:");
        foreach (var header in jwt.Header)
        {
            Console.WriteLine($"{header.Key}: {header.Value}");
        }

        // Print claims (payload)
        Console.WriteLine("\nClaims:");
        foreach (var claim in jwt.Claims)
        {
            Console.WriteLine($"{claim.Type}: {claim.Value}");
        }
    }
}
