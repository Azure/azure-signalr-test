using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Microsoft.Azure.SignalR.Test.Server
{
    public class PolicyBasedAuthRequirement : IAuthorizationRequirement
    {
        public PolicyBasedAuthRequirement()
        {
        }
    }
}
