import {HubConnection} from "@aspnet/signalr";
import * as signalR from "@aspnet/signalr";
import {Constant} from "./constant";

function appendQueryParameter(url: string, name: string, value: string) {
  var separator = url.indexOf('?') === -1 ? '?' : '&';
  return  `${url}${separator}${name}=${value}`
}

async function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function getConnections(count : number, url = Constant.url, usernameFactory? : (number) => string, accessToken? : string){
  let connections : HubConnection[] = new Array(count);
  for (let i = 0; i < connections.length; i++) {
    let username : string;
    if (usernameFactory != null) {
      username = usernameFactory(i) || `user${i}`;
    } else {
      username = `user${i}`;
    }
    connections[i] = new signalR.HubConnectionBuilder()
      .withUrl(appendQueryParameter(url, 'username', username), {
        accessTokenFactory: () => accessToken
      })
      .build();
  }
  return connections;
}

async function startConnections(connections : HubConnection[]) {
  let promise = new Array(connections.length);
  for (let i in connections) {
    promise[i] = connections[i].start().catch(err => expect(err).toBeNull());
  }
  await Promise.all(promise);
}

export {delay, getConnections, startConnections};