using Microsoft.AspNetCore.Authorization;

namespace Microsoft.Azure.SignalR.Test.Server;

[Authorize(AuthenticationSchemes = "Bearer")]
[Authorize(Roles = "Admin")]
[Authorize(Policy = "ClaimBasedAuth")]
[Authorize(Policy = "PolicyBasedAuth")]
public class ChatJwt : Chat
{
}
