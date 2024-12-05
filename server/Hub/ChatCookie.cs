using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace Microsoft.Azure.SignalR.Test.Server;

[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
[Authorize(Roles = "Admin")]
[Authorize(Policy = "ClaimBasedAuth")]
[Authorize(Policy = "PolicyBasedAuth")]
public class ChatCookie : Chat
{
}
