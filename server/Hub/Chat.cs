﻿using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace Microsoft.Azure.SignalR.Test.Server;

public class Chat : Hub
{
    public void Broadcast(string name, string message)
    {
        Clients.All.SendAsync("broadcast", name, message);
    }

    public void Echo(string name, string message)
    {
        Clients.Client(Context.ConnectionId).SendAsync("echo", name, message);
    }

    public void SendConnections(string name, IReadOnlyList<string> connections, string message)
    {
        Clients.Clients(connections).SendAsync("echo", name, message);
    }

    public void SendOthers(string name, string message)
    {
        Clients.AllExcept(Context.ConnectionId).SendAsync("echo", name, message);
    }

    public async Task JoinGroup(string name, string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("echo", name, groupName);
    }

    public async Task LeaveGroup(string name, string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        await Clients.Client(Context.ConnectionId).SendAsync("echo", name, groupName);
        await Clients.Group(groupName).SendAsync("echo", name, groupName);
    }

    public void SendGroup(string name, string groupName, string message)
    {
        Clients.Group(groupName).SendAsync("echo", name, message);
    }

    public void SendGroups(string name, IReadOnlyList<string> groups, string message)
    {
        Clients.Groups(groups).SendAsync("echo", name, message);
    }

    public void SendGroupExcept(string name, string groupName, IReadOnlyList<string> connectionIdExcept, string message)
    {
        Clients.GroupExcept(groupName, connectionIdExcept).SendAsync("echo", name, message);
    }

    public void SendOthersInGroup(string name, string groupName, string message)
    {
        Clients.OthersInGroup(groupName).SendAsync("echo", name, message);
    }

    public void SendUser(string name, string userId, string message)
    {
        Clients.User(userId).SendAsync("echo", name, message);
    }

    public void SendUsers(string name, IReadOnlyList<string> userIds, string message)
    {
        Clients.Users(userIds).SendAsync("echo", name, message);
    }

    public void GetConnectionId()
    {
        Clients.Client(Context.ConnectionId).SendAsync("getConnectionId", Context.ConnectionId);
    }

    public string GetPath()
    {
        return Context.GetHttpContext().Request.Path.Value;
    }

    public string GetQueryString()
    {
        return Context.GetHttpContext().Request.QueryString.Value;
    }
}
