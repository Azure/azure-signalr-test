import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";
import {ConnectionString} from "./connectionString";
import * as request from "request-promise";

const testMessage = 'Test Message';

test('broadcast serverless', async () => {
  const hub = 'serverless';
  
  let connections = getConnections(1, ConnectionString.getClientUrl(hub), null, ConnectionString.getToken(ConnectionString.getClientUrl(hub)));

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.broadcast, callback);
  }

  await startConnections(connections);
  
  let url = ConnectionString.getPreviewRestUrl(hub);
  await request({
    method: 'POST',
    uri: url,
    headers: {
      'Authorization': 'Bearer ' + ConnectionString.getToken(url)
    },
    body: {
      target: Constant.broadcast,
      arguments: [ 'hub-broadcast', testMessage ]
    },
    json: true
  });

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("hub-broadcast", testMessage);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('sendToUser serverless', async () => {
  const hub = 'serverless';
  const userId = 'user1'
  
  let connections = getConnections(2, ConnectionString.getClientUrl(hub), null, ConnectionString.getToken(ConnectionString.getClientUrl(hub), userId));

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.sendUser, callback);
  }

  await startConnections(connections);
  
  let url = ConnectionString.getPreviewRestUrl(hub) + '/user/' + userId;
  await request({
    method: 'POST',
    uri: url,
    headers: {
      'Authorization': 'Bearer ' + ConnectionString.getToken(url)
    },
    body: {
      target: Constant.sendUser,
      arguments: [ 'send-to-user', testMessage ]
    },
    json: true
  });

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("send-to-user", testMessage);
  expect(callback).toHaveBeenCalledTimes(2);
});
