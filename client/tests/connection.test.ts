import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";

const url = 'http://localhost:5000/chat';
const testMessage = 'Test Message';

test('connect to server', async () => {
  const connections = getConnections(1);
  await startConnections(connections);
});

test('echo', async () => {
  const connections = getConnections(1);
  const connectionName = 'connection';

  const echoCallback = jest.fn();
  connections[0].on('echo', echoCallback);

  await startConnections(connections);

  await connections[0].invoke('echo', connectionName, testMessage);

  expect(echoCallback).toBeCalledWith(connectionName, testMessage);
});

test('broadcast', async () => {
  let connections = getConnections(3);

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on('broadcast', callback);
  }

  await startConnections(connections);

  await connections[0].invoke("broadcast", "connection0", testMessage);

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("connection0", testMessage);
  expect(callback).toHaveBeenCalledTimes(3);
});
