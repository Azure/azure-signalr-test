import { getConnections, startConnections, DeferMap, promiseOrTimeout, stopConnections } from './utils';
import { Constant } from "./constant";

test('join and leave group', async () => {
  const deferMapList = [new DeferMap(), new DeferMap(), new DeferMap()];
  const groupName = 'Test Group';
  const testMessage = 'Test Message';

  let connections = getConnections(3);
  connections[0].on(Constant.echo, deferMapList[0].callback());
  connections[1].on(Constant.echo, deferMapList[1].callback());
  connections[2].on(Constant.echo, deferMapList[2].callback());
  await startConnections(connections);

  let promise0 = deferMapList[0].waitForPromise(1);
  await connections[0].invoke(Constant.joinGroup, 'connection0', groupName)
    .catch(err => expect(err).toBeNull());
  expect(await promise0).toEqual(['connection0', groupName]);

  promise0 = deferMapList[0].waitForPromise(2);
  let promise1 = deferMapList[1].waitForPromise(1);
  let promise2 = deferMapList[2].waitForPromise(1);
  await connections[1].invoke(Constant.joinGroup, 'connection1', groupName)
    .catch(err => expect(err).toBeNull());
  expect(await promise0).toEqual(['connection1', groupName]);
  expect(await promise1).toEqual(['connection1', groupName]);
  await promiseOrTimeout(promise2, Constant.awaitTimeout).catch((error) => {
    expect(error).not.toBeNull();
  });

  // Leave group
  promise1 = deferMapList[1].waitForPromise(2);
  await connections[1].invoke(Constant.leaveGroup, 'connection1', groupName)
    .catch(err => expect(err).toBeNull());
  await promise1;

  promise1 = deferMapList[1].waitForPromise(3);
  await connections[0].invoke(Constant.sendGroup, 'connection0', groupName, testMessage);
  await promiseOrTimeout(promise1, Constant.awaitTimeout).catch((error) => {
    expect(error).not.toBeNull();
  });

  await stopConnections(connections);
});

test('send group / groups / group except', async () => {
  const connectionIdPromiseName = 'connectionId';
  const deferMapList = [new DeferMap(), new DeferMap(), new DeferMap()];
  const groupName = 'Test Group';
  const groupName2 = 'Test Group 2';
  const testMessage = 'Test Message';

  let connections = getConnections(3);
  connections[0].on(Constant.echo, deferMapList[0].callback());
  connections[1].on(Constant.echo, deferMapList[1].callback());
  connections[1].on(Constant.getConnectionId, deferMapList[1].callback(connectionIdPromiseName));
  connections[2].on(Constant.echo, deferMapList[2].callback());
  await startConnections(connections);

  // Connection0 / Connection1 join Group1
  let promise0 = deferMapList[0].waitForPromise(1);
  await connections[0].invoke(Constant.joinGroup, 'connection0', groupName)
    .catch(err => expect(err).toBeNull());
  await promise0;

  let promise1 = deferMapList[1].waitForPromise(1);
  await connections[1].invoke(Constant.joinGroup, 'connection1', groupName)
    .catch(err => expect(err).toBeNull());
  await promise1;

  promise0 = deferMapList[0].waitForPromise(3);
  promise1 = deferMapList[1].waitForPromise(2);
  await connections[0].invoke(Constant.sendGroup, 'connection0', groupName, testMessage);
  expect(await promise0).toEqual(['connection0', testMessage]);
  expect(await promise1).toEqual(['connection0', testMessage]);

  // Connection2 join Group2 and send to Group1 and Group2
  let promise2 = deferMapList[2].waitForPromise(1);
  await connections[2].invoke(Constant.joinGroup, 'connection2', groupName2)
    .catch(err => expect(err).toBeNull());
  await promise2;

  promise0 = deferMapList[0].waitForPromise(4);
  promise1 = deferMapList[1].waitForPromise(3);
  promise2 = deferMapList[2].waitForPromise(2);
  await connections[2].invoke(Constant.sendGroups, 'connection2', [groupName, groupName2], testMessage);
  expect(await promise0).toEqual(['connection2', testMessage]);
  expect(await promise1).toEqual(['connection2', testMessage]);
  expect(await promise2).toEqual(['connection2', testMessage]);

  // Get connection Id of connection1
  let connectionIdPromise = deferMapList[1].waitForPromise(connectionIdPromiseName);
  await connections[1].invoke(Constant.getConnectionId);
  let [connectionId1] = await connectionIdPromise;

  promise0 = deferMapList[0].waitForPromise(5);
  promise1 = deferMapList[1].waitForPromise(4);
  await connections[1].invoke(Constant.sendGroupExcept, 'connection1', groupName, [connectionId1], testMessage);
  expect(await promise0).toEqual(['connection1', testMessage]);
  await promiseOrTimeout(promise1, Constant.awaitTimeout).catch((error) => {
    expect(error).not.toBeNull();
  });

  await stopConnections(connections);
});

test('send others in group', async () => {
  const deferMapList = [new DeferMap(), new DeferMap(), new DeferMap()];
  const groupName = 'Test Group';
  const testMessage = 'Test Message';

  let connections = getConnections(3);
  connections[0].on(Constant.echo, deferMapList[0].callback());
  connections[1].on(Constant.echo, deferMapList[1].callback());
  connections[2].on(Constant.echo, deferMapList[2].callback());
  await startConnections(connections);

  let promise0 = deferMapList[0].waitForPromise(1);
  let promise1 = deferMapList[1].waitForPromise(1);
  let promise2 = deferMapList[2].waitForPromise(1);
  await connections[0].invoke(Constant.joinGroup, 'connection0', groupName);
  await promise0;
  await connections[1].invoke(Constant.joinGroup, 'connection1', groupName);
  await promise1;
  await connections[2].invoke(Constant.joinGroup, 'connection2', groupName);
  await promise2;

  promise0 = deferMapList[0].waitForPromise(4);
  promise1 = deferMapList[1].waitForPromise(3);
  promise2 = deferMapList[2].waitForPromise(2);
  await connections[0].invoke(Constant.sendOthersInGroup, 'connection0', groupName, testMessage);
  expect(await promise1).toEqual(['connection0', testMessage]);
  expect(await promise2).toEqual(['connection0', testMessage]);
  await promiseOrTimeout(promise0, Constant.awaitTimeout).catch((error) => {
    expect(error).not.toBeNull();
  });

  await stopConnections(connections);
});