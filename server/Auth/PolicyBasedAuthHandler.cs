using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Microsoft.Azure.SignalR.Test.Server
{
    public class PolicyBasedAuthHandler : AuthorizationHandler<PolicyBasedAuthRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            PolicyBasedAuthRequirement requirement)
        {
            if (context.User.IsInRole("Admin"))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
