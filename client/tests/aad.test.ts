import { getConnections, startConnections, stopConnections } from "./utils";
import { Constant } from "./constant";
import * as request from "request-promise";

function AadTokenFactory() : Promise<string> {
  return request(`${Constant.ServerAad.Host}/aad/login`);
}

test('aad connect to server', async () => {
  const connections = getConnections(1, Constant.ServerAad.ChatUrl, null, AadTokenFactory);
  await startConnections(connections);
  await stopConnections(connections);
});