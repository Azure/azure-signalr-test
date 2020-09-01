import { ConnectionString } from "./connectionString";
import * as request from "request-promise";

async function sendMessage(url: string, target: string, args: string[]) {
  await request({
    method: 'POST',
    uri: url,
    headers: {
      'Authorization': 'Bearer ' + ConnectionString.getTokenFactory(url)()
    },
    body: {
      target: target,
      arguments: args
    },
    json: true
  });
}

async function sendControl(url: string, method: string) {
  await request({
    method: method,
    uri: url,
    headers: {
      'Authorization': 'Bearer ' + ConnectionString.getTokenFactory(url)()
    }
  });
}

export class Rest {
  public static readonly broadcast = async function (hub: string, target: string, args: string[]) {
    let url = ConnectionString.getRestUrl(hub);
    await sendMessage(url, target, args);
  };

  public static readonly sendToUser = async function (hub: string, userId: string, target: string, args: string[]) {
    let url = ConnectionString.getRestUrl(hub) + '/users/' + userId;
    await sendMessage(url, target, args);
  }

  public static readonly sendToGroup = async function (hub: string, group: string, target: string, args: string[]) {
    let url = ConnectionString.getRestUrl(hub) + '/groups/' + group;
    await sendMessage(url, target, args);
  }

  public static readonly addUserToGroup = async function (hub: string, group: string, userId: string) {
    let url = ConnectionString.getRestUrl(hub) + '/groups/' + group + '/users/' + userId;
    await sendControl(url, 'PUT');
  }

  public static readonly removeUserFromGroup = async function (hub: string, group: string, userId: string) {
    let url = ConnectionString.getRestUrl(hub) + '/groups/' + group + '/users/' + userId;
    await sendControl(url, 'DELETE');
  }
};