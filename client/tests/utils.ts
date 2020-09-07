import { HubConnection } from "@aspnet/signalr";
import * as signalR from "@aspnet/signalr";
import { Constant } from "./constant";

function appendQueryParameter(url: string, name: string, value: string) {
  var separator = url.indexOf('?') === -1 ? '?' : '&';
  return `${url}${separator}${name}=${value}`
}

async function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function getConnections(count : number, url = Constant.Server.ChatUrl, usernameFactory? : (number) => string, accessTokenFactory? : () => string | Promise<string>){
  let connections : HubConnection[] = new Array(count);
  for (let i = 0; i < connections.length; i++) {
    let username: string;
    if (usernameFactory != null) {
      username = usernameFactory(i) || `user${i}`;
    } else {
      username = `user${i}`;
    }
    connections[i] = new signalR.HubConnectionBuilder()
      .withUrl(appendQueryParameter(url, 'username', username), {
        accessTokenFactory: accessTokenFactory
      })
      .build();
  }
  return connections;
}

async function startConnections(connections: HubConnection[]) {
  let promise = new Array(connections.length);
  for (let i in connections) {
    promise[i] = connections[i].start().catch(err => expect(err).toBeNull());
  }
  await Promise.all(promise);
}

async function stopConnections(connections: HubConnection[]) {
  let promise = new Array(connections.length);
  for (let i in connections) {
    promise[i] = connections[i].stop();
  }
  await Promise.all(promise);
}

async function promiseOrTimeout(promise: Promise<void>, timeout: number) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
  ])
}

function Deferred() {
  this.resolve = null;
  this.reject = null;

  this.promise = new Promise(function (resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  }.bind(this));
  Object.freeze(this);
}

class DeferMap {
  deferMap: Map<number | string, any>;
  index: number;

  constructor() {
    this.deferMap = new Map();
    // The index is count of calls
    this.index = 1;
  }

  waitForPromise = (name: string | number) => {
    let defer = new Deferred();
    this.deferMap.set(name, defer);
    return defer.promise;
  };

  setPromiseResult = (name: string | number = null, ...result: any[]) => {
    if (name == null) {
      name = this.index;
      this.index = this.index + 1;
    }
    if (this.deferMap.has(name)) {
      this.deferMap.get(name).resolve(result);
    }
  };

  callback = (name: number | string = null, options: Function = null) => {
    return (...args: any[]) => {
      if (options != null) {
        options();
      }
      this.setPromiseResult(name, ...args);
    };
  };
}

export { delay, getConnections, startConnections, stopConnections, promiseOrTimeout, Deferred, DeferMap };