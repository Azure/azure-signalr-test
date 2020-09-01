using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Microsoft.Azure.SignalR.Test.Server
{
    public class GenericChat<T> : Hub<T> where T : class, IChat
    {
        public void Echo(string name, string message)
        {
            Clients.Client(Context.ConnectionId).Echo(name, message);
        }
    }

    public interface IChat
    {
        Task Echo(String name, String message);
    }
}
