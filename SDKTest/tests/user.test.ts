import { delay, getConnections, startConnections, DeferMap, promiseOrTimeout, stopConnections } from './utils';
import { Constant } from "./constant";

test('send user and users', async () => {
  const deferMapList = [new DeferMap(), new DeferMap()];
  const testMessage = 'Test Message';

  let connections = getConnections(2);
  connections[0].on(Constant.echo, deferMapList[0].callback());
  connections[1].on(Constant.echo, deferMapList[1].callback());
  await startConnections(connections);

  let promise0 = deferMapList[0].waitForPromise(1);
  let promise1 = deferMapList[1].waitForPromise(1);
  await connections[0].invoke(Constant.sendUser, 'connection0', 'user0', testMessage);
  expect(await promise0).toEqual(['connection0', testMessage]);
  await promiseOrTimeout(promise1, Constant.awaitTimeout).catch(error => expect(error).not.toBeNull());

  promise0 = deferMapList[0].waitForPromise(2);
  await connections[1].invoke(Constant.sendUsers, 'connection1', ['user0', 'user1'], testMessage);
  expect(await promise0).toEqual(['connection1', testMessage]);
  expect(await promise1).toEqual(['connection1', testMessage]);
  await stopConnections(connections);
});
