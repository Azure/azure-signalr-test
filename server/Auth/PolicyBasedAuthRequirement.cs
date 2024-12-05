using Microsoft.AspNetCore.Authorization;

namespace Microsoft.Azure.SignalR.Test.Server;

public class PolicyBasedAuthRequirement : IAuthorizationRequirement
{
    public PolicyBasedAuthRequirement()
    {
    }
}
