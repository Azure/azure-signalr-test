using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace Microsoft.Azure.SignalR.Test.Server
{
    public interface IChat
    {
        Task Echo(string name, string message);
    }

    public class GenericChat<T> : Hub<T> where T : class, IChat
    {
        public void Echo(string name, string message)
        {
            Clients.Client(Context.ConnectionId).Echo(name, message);
        }
    }
}
