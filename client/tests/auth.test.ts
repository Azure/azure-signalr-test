import {delay, getConnections, startConnections} from "./utils";
import {Constant} from "./constant";

test('auth with cookie', async () => {
  let connections = getConnections(1, `${Constant.url}cookie`, 'cookie');
  let callback = jest.fn();
  connections[0].on(Constant.echo, callback);
});