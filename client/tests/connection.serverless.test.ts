import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";
import * as request from "request-promise";
import * as nJwt from "njwt";

const testMessage = 'Test Message';

test('broadcast serverless', async () => {
  let connections = getConnections(2, Constant.serverlessUrl);

  const callback = jest.fn();
  for (let i = 0; i < connections.length; i++) {
    connections[i].on(Constant.broadcast, callback);
  }

  await startConnections(connections);

  const endpoint = 'https://kevinzha-sea.service.signalr.net:5002/api/v1-preview/hub/serverless';

  var claims = {
    "aud": endpoint,
    "exp": new Date().valueOf() + (24*60*60*1000)
  };
  
  var jwt = nJwt.create(claims,"4oJqfZsjqpX1OKxS7znDyGjfts7zhB55MNwGcNKPSEE=","HS256");
  var token = jwt.compact();
  console.log(token);

  await request({
    method: 'POST',
    uri: endpoint,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    body: {
      target: Constant.broadcast,
      arguments: [ 'hub-broadcast', testMessage ]
    },
    json: true
  });

  await delay(Constant.delay);
  expect(callback).toBeCalledWith("hub-broadcast", testMessage);
  expect(callback).toHaveBeenCalledTimes(2);
});

/*
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
*/
