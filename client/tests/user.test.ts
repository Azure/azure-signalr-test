import {delay, getConnections, startConnections} from './utils';
import {Constant} from "./constant";

test('send user and users', async () => {
  const callback = [jest.fn(), jest.fn()];
  const testMessage = 'Test Message';

  let connections = getConnections(2);
  connections[0].on(Constant.echo, callback[0]);
  connections[1].on(Constant.echo, callback[1]);
  await startConnections(connections);

  await connections[0].invoke(Constant.sendUser, 'connection0', 'user0', testMessage);
  await delay(Constant.delay);
  expect(callback[0]).toHaveBeenCalledWith('connection0', testMessage);
  expect(callback[1]).toHaveBeenCalledTimes(0);

  await connections[1].invoke(Constant.sendUsers, 'connection1', ['user0', 'user1'], testMessage);
  await delay(Constant.delay);
  expect(callback[0]).toHaveBeenCalledWith('connection1', testMessage);
  expect(callback[1]).toHaveBeenCalledWith('connection1', testMessage);
});
