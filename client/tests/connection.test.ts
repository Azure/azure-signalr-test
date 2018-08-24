import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";

const testMessage = 'Test Message';

test('connect to server', async () => {
  const connections = getConnections(1);
  await startConnections(connections);
});

test('echo', async () => {
  const connections = getConnections(1);
  const connectionName = 'connection';

  const echoCallback = jest.fn();
  connections[0].on(Constant.echo, echoCallback);

  await startConnections(connections);

  await connections[0].invoke(Constant.echo, connectionName, testMessage);

  expect(echoCallback).toBeCalledWith(connectionName, testMessage);
});

test('broadcast', async () => {
  let connections = getConnections(3);

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.broadcast, callback);
  }

  await startConnections(connections);

  await connections[0].invoke(Constant.broadcast, "connection0", testMessage);

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("connection0", testMessage);
  expect(callback).toHaveBeenCalledTimes(3);
});

test('send others', async () => {
  let connections = getConnections(3);

  const callbacks = [jest.fn(), jest.fn(), jest.fn()];
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.echo, callbacks[i]);
  }

  await startConnections(connections);

  await connections[0].invoke(Constant.sendOthers, "connection0", testMessage);
  await delay(Constant.delay);

  expect(callbacks[0]).not.toHaveBeenCalledWith("connection0", testMessage);
  expect(callbacks[1]).toHaveBeenCalledWith("connection0", testMessage);
  expect(callbacks[2]).toHaveBeenCalledWith("connection0", testMessage);
});

