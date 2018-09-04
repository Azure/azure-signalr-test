import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";
import {ConnectionString} from "./connectionString";
import * as request from "request-promise";
import * as nJwt from "njwt";

const testMessage = 'Test Message';

test('broadcast serverless', async () => {
  let clientToken = nJwt.create({
    "aud": ConnectionString.clientUrl,
    "name": "user1",
    "exp": new Date().valueOf() + (24*60*60*1000)
  },ConnectionString.key,"HS256")
  let connections = getConnections(1, ConnectionString.clientUrl, (n)=>'user1' + n, clientToken);

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.echo, callback);
  }

  await startConnections(connections);
  
  let serverToken = nJwt.create({
    "aud": ConnectionString.serverUrl,
    "exp": new Date().valueOf() + (24*60*60*1000)
  },ConnectionString.key,"HS256").compact();

  await request({
    method: 'POST',
    uri: ConnectionString.serverUrl,
    headers: {
      'Authorization': 'Bearer ' + serverToken
    },
    body: {
      target: Constant.echo,
      arguments: [ 'hub-broadcast', testMessage ]
    },
    json: true
  });

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("hub-broadcast", testMessage);
  expect(callback).toHaveBeenCalledTimes(1);
});
