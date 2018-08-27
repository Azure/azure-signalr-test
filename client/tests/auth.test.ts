import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";
import * as request from "request-promise";

const testMessage = 'Test Message';

test('auth with jwt', async () => {
  let usernameFactory = function(_) : string {return 'jwtUser'};
  let username = usernameFactory(0);
  let role = 'Admin';
  let token = await request(`${Constant.host}/jwt/login?username=${username}&role=${role}`);

  let connections = getConnections(1, `${Constant.url}jwt`, usernameFactory, token);
  let callback = jest.fn();
  connections[0].on(Constant.echo, callback);
  await startConnections(connections);
  await connections[0].invoke(Constant.echo, 'connection0', testMessage);
  await delay(Constant.delay);
  expect(callback).toHaveBeenCalledWith('connection0', testMessage);
});