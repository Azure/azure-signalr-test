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
    connections[i].on(Constant.echo, callback);
  }

  await startConnections(connections);
  
  await request({
    method: 'POST',
    uri: ConnectionString.getServerUrl(hub),
    headers: {
      'Authorization': 'Bearer ' + ConnectionString.getToken(ConnectionString.getServerUrl(hub))
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
