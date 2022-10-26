import { getConnections, startConnections, stopConnections } from "./utils";
import { Constant } from "./constant";

const testMessage = "Test Message";

test("generic hub", async () => {
  const connections = getConnections(1, `${Constant.Server.Host}/genericchat`);
  const connectionName = "connection";

  const echoCallback = jest.fn();
  connections[0].on("echo", echoCallback);

  await startConnections(connections);

  await connections[0].invoke("echo", connectionName, testMessage);

  expect(echoCallback).toBeCalledWith(connectionName, testMessage);
  await stopConnections(connections);
});

test("long name hub with length 128", async () => {
  const connections = getConnections(1, `${Constant.Server.Host}/longnamechat`);
  const connectionName = "connection";

  const echoCallback = jest.fn();
  connections[0].on("echo", echoCallback);

  await startConnections(connections);

  await connections[0].invoke("echo", connectionName, testMessage);

  expect(echoCallback).toBeCalledWith(connectionName, testMessage);
  await stopConnections(connections);
});
