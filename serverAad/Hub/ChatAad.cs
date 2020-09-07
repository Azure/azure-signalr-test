using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Azure.SignalR.Test.Server;

namespace Microsoft.Azure.SignalR.Test.ServerAad
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatAad : Chat
    {
    }
}
