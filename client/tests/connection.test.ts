import { DeferMap, getConnections, promiseOrTimeout, startConnections, stopConnections } from "./utils";
import { Constant } from "./constant";

const testMessage = 'Test Message';

test('connect to server', async () => {
  const connections = getConnections(1);
  await startConnections(connections);
  await stopConnections(connections);
});

test('echo', async () => {
  const connections = getConnections(1);
  const connectionName = 'connection';

  const echoCallback = jest.fn();
  connections[0].on(Constant.echo, echoCallback);

  await startConnections(connections);

  await connections[0].invoke(Constant.echo, connectionName, testMessage);

  expect(echoCallback).toBeCalledWith(connectionName, testMessage);
  await stopConnections(connections);
});

test('broadcast', async () => {
  const deferMap = new DeferMap();

  let connections = getConnections(3);
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.broadcast, deferMap.callback());
  }
  await startConnections(connections);

  let promise = deferMap.waitForPromise(3);
  await connections[0].invoke(Constant.broadcast, "connection0", testMessage);
  expect(await promise).toEqual(['connection0', testMessage]);
  await stopConnections(connections);
});

test('send others', async () => {
  const deferMapList = [new DeferMap(), new DeferMap(), new DeferMap()];

  let connections = getConnections(3);
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.echo, deferMapList[i].callback());
  }
  await startConnections(connections);

  let promise0 = deferMapList[0].waitForPromise(1);
  let promise1 = deferMapList[1].waitForPromise(1);
  let promise2 = deferMapList[2].waitForPromise(1);
  await connections[0].invoke(Constant.sendOthers, "connection0", testMessage);
  expect(await promise1).toEqual(['connection0', testMessage]);
  expect(await promise2).toEqual(['connection0', testMessage]);
  await promiseOrTimeout(promise0, Constant.awaitTimeout).catch(error => expect(error).not.toBeNull());
  await stopConnections(connections);
});

