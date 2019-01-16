import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";
import {ConnectionString} from "./connectionString";
import {Rest} from "./rest";

const testMessage = 'Test Message';

test('broadcast serverless', async () => {
  const hub = 'serverless';
  
  let connections = getConnections(1, ConnectionString.getClientUrl(hub), null, ConnectionString.getToken(ConnectionString.getClientUrl(hub)));

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.broadcast, callback);
  }

  await startConnections(connections);
  
  await Rest.broadcast(hub, Constant.broadcast, [ 'hub-broadcast', testMessage ]);

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("hub-broadcast", testMessage);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('sendToUser serverless', async () => {
  const hub = 'serverless';
  const userId = 'user1';
  
  let connections = getConnections(2, ConnectionString.getClientUrl(hub), null, ConnectionString.getToken(ConnectionString.getClientUrl(hub), userId));

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.sendUser, callback);
  }

  await startConnections(connections);
  
  await Rest.sendToUser(hub, userId, Constant.sendUser, [ 'send-to-user', testMessage ]);

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("send-to-user", testMessage);
  expect(callback).toHaveBeenCalledTimes(2);
});

test('sendToGroup serverless', async () => {
  const hub = 'serverless';
  const group = 'groupX';
  const userId = 'userA';
  
  let conn1 = getConnections(1, ConnectionString.getClientUrl(hub), null, ConnectionString.getToken(ConnectionString.getClientUrl(hub), userId));

  const callback = jest.fn();
  for (let i = 0; i < conn1.length; i++) {
    conn1[i].on(Constant.sendGroup, callback);
  }

  await startConnections(conn1);
  
  await Rest.addUserToGroup(hub, group, userId);
  await delay(Constant.delay);

  await Rest.sendToGroup(hub, group, Constant.sendGroup, [ 'send-to-group', testMessage ]);
  await delay(Constant.delay);

  expect(callback).toBeCalledWith("send-to-group", testMessage);
  expect(callback).toHaveBeenCalledTimes(1);

  let conn2 = getConnections(1, ConnectionString.getClientUrl(hub), null, ConnectionString.getToken(ConnectionString.getClientUrl(hub), userId));

  for (let i = 0; i < conn2.length; i++) {
    conn2[i].on(Constant.sendGroup, callback);
  }

  await startConnections(conn2);

  await Rest.sendToGroup(hub, group, Constant.sendGroup, [ 'send-to-group', testMessage ]);
  await delay(Constant.delay);

  expect(callback).toHaveBeenCalledTimes(3);

  await Rest.removeUserFromGroup(hub, group, userId);
  await delay(Constant.delay);

  await Rest.sendToGroup(hub, group, Constant.sendGroup, [ 'send-to-group', testMessage ]);
  await delay(Constant.delay);

  expect(callback).toHaveBeenCalledTimes(3);
});
