import {delay, getConnections, startConnections} from './utils';
import {Constant} from "./constant";

test('join and leave group', async () => {
  const callback = [jest.fn(), jest.fn(), jest.fn()];
  const groupName = 'Test Group';
  const testMessage = 'Test Message';

  let connections = getConnections(3);
  connections[0].on(Constant.echo, callback[0]);
  connections[1].on(Constant.echo, callback[1]);
  connections[2].on(Constant.echo, callback[2]);
  await startConnections(connections);

  await connections[0].invoke(Constant.joinGroup, 'connection0', groupName)
    .catch(err => expect(err).toBeNull());
  await delay(Constant.delay);
  await connections[1].invoke(Constant.joinGroup, 'connection1', groupName)
    .catch(err => expect(err).toBeNull());

  await delay(Constant.delay);
  expect(callback[0]).toHaveBeenCalledWith('connection0', groupName);
  expect(callback[0]).toHaveBeenCalledWith('connection1', groupName);
  expect(callback[1]).toHaveBeenCalledWith('connection1', groupName);
  expect(callback[2]).not.toHaveBeenCalled();

  // Leave group
  await connections[1].invoke(Constant.leaveGroup, 'connection1', groupName)
    .catch(err => expect(err).toBeNull());
  await delay(Constant.delay);
  await connections[0].invoke(Constant.sendGroup, 'connection0', groupName, testMessage);
  await delay(Constant.delay);
  expect(callback[1]).not.toHaveBeenCalledWith('connection0', testMessage);
});

test('send group / groups / group except', async () => {
  let connectionId1 : string;
  const callback = [jest.fn(), jest.fn(), jest.fn()];
  const groupName = 'Test Group';
  const groupName2 = 'Test Group 2';
  const testMessage = 'Test Message';

  let connections = getConnections(3);
  connections[0].on(Constant.echo, callback[0]);
  connections[1].on(Constant.echo, callback[1]);
  connections[1].on(Constant.getConnectionId, id => connectionId1 = id);
  connections[2].on(Constant.echo, callback[2]);
  await startConnections(connections);

  // Connection0 / Connection1 join Group1
  await connections[0].invoke(Constant.joinGroup, 'connection0', groupName)
    .catch(err => expect(err).toBeNull());
  await connections[1].invoke(Constant.joinGroup, 'connection1', groupName)
    .catch(err => expect(err).toBeNull());

  await delay(Constant.delay);

  await connections[0].invoke(Constant.sendGroup, 'connection0', groupName, testMessage);
  await delay(Constant.delay);
  expect(callback[0]).toHaveBeenCalledWith('connection0', testMessage);
  expect(callback[1]).toHaveBeenCalledWith('connection0', testMessage);

  // Connection2 join Group2 and send to Group1 and Group2
  await connections[2].invoke(Constant.joinGroup, 'connection2', groupName2)
    .catch(err => expect(err).toBeNull());
  await delay(Constant.delay);

  await connections[2].invoke(Constant.sendGroups, 'connection2', [groupName, groupName2], testMessage);
  await delay(Constant.delay);
  expect(callback[0]).toHaveBeenCalledWith('connection2', testMessage);
  expect(callback[1]).toHaveBeenCalledWith('connection2', testMessage);
  expect(callback[2]).toHaveBeenCalledWith('connection2', testMessage);

  // Connection1 send to Group1 except connection1
  await connections[1].invoke(Constant.getConnectionId);
  await delay(Constant.delay);
  await connections[1].invoke(Constant.sendGroupExcept, 'connection1', groupName, [connectionId1], testMessage);
  await delay(Constant.delay);
  expect(callback[0]).toHaveBeenCalledWith('connection1', testMessage);
  expect(callback[1]).not.toHaveBeenCalledWith('connection1', testMessage);
});

test('send others in group', async () => {
  let connectionId0 : string;
  const callback = [jest.fn(), jest.fn(), jest.fn()];
  const groupName = 'Test Group';
  const testMessage = 'Test Message';

  let connections = getConnections(3);
  connections[0].on(Constant.echo, callback[0]);
  connections[0].on(Constant.getConnectionId, id => connectionId0 = id);
  connections[1].on(Constant.echo, callback[1]);
  connections[2].on(Constant.echo, callback[2]);
  await startConnections(connections);

  await connections[0].invoke(Constant.joinGroup, 'connection0', groupName);
  await connections[1].invoke(Constant.joinGroup, 'connection1', groupName);
  await connections[2].invoke(Constant.joinGroup, 'connection2', groupName);

  await delay(Constant.delay);
  await connections[0].invoke(Constant.getConnectionId);
  await delay(Constant.delay);

  expect(callback[1]).toHaveBeenCalledTimes(2);

  await connections[0].invoke(Constant.sendOthersInGroup, 'connection0', groupName, testMessage);
  await delay(Constant.delay*3);

  expect(callback[0]).not.toHaveBeenCalledWith('connection0', testMessage);
  expect(callback[1]).toHaveBeenCalledWith('connection0', testMessage);
  expect(callback[2]).toHaveBeenCalledWith('connection0', testMessage);
  expect(callback[1]).toHaveBeenCalledTimes(3);
});