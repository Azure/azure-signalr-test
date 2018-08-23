import {HubConnection} from "@aspnet/signalr";
import * as signalR from "@aspnet/signalr";
import {Constant} from "./constant";
import {} from "request";

async function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function getConnections(count : number, url = Constant.url, usernamePrefix? : string) {
  let connections : HubConnection[] = new Array(count);
  for (let i = 0; i < connections.length; i++) {
    connections[i] = new signalR.HubConnectionBuilder()
      .withUrl(`${url}?username=${usernamePrefix}user${i}`)
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