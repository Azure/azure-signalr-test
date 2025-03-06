using System.IdentityModel.Tokens.Jwt;

using Azure.Core;
using Azure.Identity;

internal class Program
{
    private static async Task Main(string[] args)
    {
        var credential = new DefaultAzureCredential();

        var request = new TokenRequestContext(["https://azure.signalr.com/.default"]);

        var token = await credential.GetTokenAsync(request);

        var handler = new JwtSecurityTokenHandler();

        // Check if the token is valid and can be read
        if (!handler.CanReadToken(token.Token))
        {
            Console.WriteLine("Invalid token.");
            return;
        }

        // Read the token
        var jwtToken = handler.ReadJwtToken(token.Token);

        // Print header information
        Console.WriteLine("Header:");
        foreach (var header in jwtToken.Header)
        {
            Console.WriteLine($"{header.Key}: {header.Value}");
        }

        // Print claims (payload)
        Console.WriteLine("\nClaims:");
        foreach (var claim in jwtToken.Claims)
        {
            Console.WriteLine($"{claim.Type}: {claim.Value}");
        }
    }
}